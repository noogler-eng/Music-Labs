import { Server, Socket } from "socket.io";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import prisma from "./db/prisma";
import { z } from "zod";

var YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const dataZod = z.object({
  url: z.string().includes("youtube").or(z.string().includes("spotify")), // either has youtube or spotify
});

interface user {
  streamId: string;
  ws: Socket;
}

interface room {
  wss: any;
  users: user[];
}

class RoomManager {
  // room contains many websocet user's
  private rooms: Map<string, room>;

  constructor() {
    this.rooms = new Map<string, room>();
  }

  async initRoom(streamsId: string, data: any, ws: Socket) {
    if (!this.rooms.get(streamsId)) {
      this.rooms.set(streamsId, {
        wss: new Server(),
        users: [],
      });
      this.rooms.get(streamsId)?.users.push({
        streamId: data.streamId,
        ws: ws,
      });

      const songs = await prisma.stream.findMany({
        where: {
          userId: streamsId,
        },
      });

      if (!songs) {
        ws.send(
          JSON.stringify({
            error: "no song exists",
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: "init room",
            currentSong: songs[0],
            queueSongs: songs.slice(1, songs.length),
          })
        );
      }
    } else {
      this.rooms.get(streamsId)?.users.push({
        streamId: data.streamId,
        ws: ws,
      });
    }
  }

  async addSong(streamsId: string, data: any, ws: Socket) {
    const room = this.rooms.get(streamsId);
    if (!room) return;

    const isSuccess = dataZod.safeParse(data);
    const extractedId = isSuccess.data?.url.split("?v=")[1];
    const isValidYTUrl: any = isSuccess.data?.url.match(YT_REGEX);
    if (!isValidYTUrl) throw new Error("Invalid url");

    const videoData = await youtubesearchapi.GetVideoDetails(extractedId);
    const length = videoData.thumbnail.thumbnails.length;

    await prisma.stream.create({
      data: {
        userId: streamsId,
        type: isSuccess.data?.url.includes("spotify") ? "SPOTIFY" : "YOUTUBE",
        title: videoData?.title || "",
        url: isSuccess.data?.url || "",
        extractedId: extractedId || "",
        smallImg: videoData.thumbnail.thumbnails[length - 2].url || "",
        bigImg: videoData.thumbnail.thumbnails[length - 1].url || "",
      },
    });

    const songs = await prisma.stream.findMany({
      where: {
        userId: streamsId,
      },
    });

    room?.wss.clients.forEach((ws: WebSocket) => {
      ws.send(
        JSON.stringify({
          type: "song added",
          currentSong: songs[0],
          queueSongs: songs.slice(1, songs.length),
        })
      );
    });
  }

  async deleteSong(streamsId: string, data: any) {
    const room = this.rooms.get(streamsId);
    if (!room) return;

    await prisma.stream.deleteMany({
      where: {
        id: data.songId,
      },
    });

    room?.wss.clients.forEach((ws: WebSocket) => {
      ws.send(
        JSON.stringify({
          type: "song deleted",
        })
      );
    });
  }

  async upVoteSong(userId: string, streamsId: string, data: any, ws: Socket) {
    const room = this.rooms.get(streamsId);
    if (!room) return;

    const user = await prisma.upvote.findFirst({
      where: {
        userId: userId,
        streamId: data.songId,
      },
    });

    if (user) {
      ws.send(
        JSON.stringify(
          JSON.stringify({
            type: "already voted",
          })
        )
      );
      return;
    }

    await prisma.upvote.create({
      data: {
        userId: userId,
        streamId: data.songId,
      },
    });

    const songs = await prisma.stream.findMany({
      where: {
        userId: streamsId,
      },
    });

    room?.wss.clients.forEach((ws: Socket) => {
      ws.send(
        JSON.stringify({
          type: "song added",
          currentSong: songs[0],
          queueSongs: songs.slice(1, songs.length),
        })
      );
    });
  }

  async downVoteSong(userId: string, streamsId: string, data: any, ws: Socket) {
    const room = this.rooms.get(streamsId);
    if (!room) return;

    const user = await prisma.upvote.findFirst({
      where: {
        userId: userId,
        streamId: data.songId,
      },
    });

    if (!user) {
      ws.send(
        JSON.stringify(
          JSON.stringify({
            type: "not voted yet",
          })
        )
      );
      return;
    }
    await prisma.upvote.deleteMany({
      where: {
        userId: userId,
        streamId: data.songId,
      },
    });

    const songs = await prisma.stream.findMany({
      where: {
        userId: streamsId,
      },
    });

    room?.wss.clients.forEach((ws: Socket) => {
      ws.send(
        JSON.stringify({
          type: "song added",
          currentSong: songs[0],
          queueSongs: songs.slice(1, songs.length),
        })
      );
    });
  }

  async leaveRoom(streamsId: string, data: any, ws: Socket) {
    const room = this.rooms.get(streamsId);
    if (!room) return;

    room.users = room.users.filter((user) => user.ws !== ws);
    if (room.users.length === 0) {
      this.rooms.delete(streamsId);
    }
  }

  broadcastToRoom(streamsId: string, message: any) {
    const room = this.rooms.get(streamsId);
    room?.wss.clients.forEach((client: WebSocket) => {
      client.send(JSON.stringify(message));
    });
  }
}

export default RoomManager;

import { Server, Socket } from "socket.io";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import prisma from "./db/prisma";
import { z } from "zod";

var YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const dataZod = z.object({
  url: z.string().includes("youtube").or(z.string().includes("spotify")),
});

interface user {
  userId: string;
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

  async initRoom(
    streamId: string,
    data: {
      userId: string;
    },
    ws: Socket
  ) {
    if (!this.rooms.get(streamId)) {
      this.rooms.set(streamId, {
        wss: new Server(),
        users: [],
      });
      this.rooms.get(streamId)?.users.push({
        userId: data.userId,
        ws: ws,
      });
    } else {
      this.rooms.get(streamId)?.users.push({
        userId: data.userId,
        ws: ws,
      });
    }

    const room = this.rooms.get(streamId);
    if (!room) throw new Error("no room");

    const songs = await prisma.stream.findMany({
      where: {
        userId: streamId,
      },
    });

    if (songs.length == 0) {
      ws.emit("error", "no song is there!");
    } else {
      ws.emit(
        "songs",
        JSON.stringify({
          currentSong: songs[0],
          queueSongs: songs.slice(1, songs.length),
        })
      );
    }

    ws.on("disconnect", () => {
      room.users = room.users.filter((user) => user.userId !== data.userId);
      if (room.users.length === 0) {
        this.rooms.delete(streamId);
      }
    });
  }

  async addSong(streamId: string, data: any) {
    const room = this.rooms.get(streamId);
    if (!room) return;

    const isSuccess = dataZod.safeParse(data);
    const extractedId = isSuccess.data?.url.split("?v=")[1];
    const isValidYTUrl: any = isSuccess.data?.url.match(YT_REGEX);
    if (!isValidYTUrl) throw new Error("Invalid url");

    const videoData = await youtubesearchapi.GetVideoDetails(extractedId);
    const length = videoData.thumbnail.thumbnails.length;

    await prisma.stream.create({
      data: {
        userId: streamId,
        type: isSuccess.data?.url.includes("spotify") ? "SPOTIFY" : "YOUTUBE",
        title: videoData?.title || "",
        url: isSuccess.data?.url || "",
        extractedId: extractedId || "",
        smallImg: videoData.thumbnail.thumbnails[length - 2].url || "",
        bigImg: videoData.thumbnail.thumbnails[length - 1].url || "",
      },
    });

    await this.broadcastToRoom(streamId);
  }

  async deleteSong(streamId: string, data: any) {
    const room = this.rooms.get(streamId);
    if (!room) return;

    await prisma.stream.deleteMany({
      where: {
        id: data.id,
      },
    });

    await this.broadcastToRoom(streamId);
  }

  async upVoteSong(userId: string, streamId: string, data: any, ws: Socket) {
    const room = this.rooms.get(streamId);
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

    await this.broadcastToRoom(streamId);
  }

  async downVoteSong(userId: string, streamId: string, data: any, ws: Socket) {
    const room = this.rooms.get(streamId);
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

    await this.broadcastToRoom(streamId);
  }

  async leaveRoom(streamsId: string, data: any, ws: Socket) {
    const room = this.rooms.get(streamsId);
    if (!room) return;

    room.users = room.users.filter((user) => user.ws !== ws);
    if (room.users.length === 0) {
      this.rooms.delete(streamsId);
    }
  }

  async broadcastToRoom(streamId: string) {
    const room = this.rooms.get(streamId);
    if (!room) return;

    const songs = await prisma.stream.findMany({
      where: { userId: streamId },
    });

    console.log("Broadcasting songs to room:", streamId);

    // Prepare the data to send to each client
    const songData = JSON.stringify({
      currentSong: songs[0] || null,
      queueSongs: songs.slice(1),
    });

    // Emit the song data to each user in the room
    room.users.forEach((user) => {
      user.ws.emit("songs", songData);
    });
  }
}

export default RoomManager;

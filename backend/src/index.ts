import WebSocketServer, { WebSocket } from "ws";
import RoomManager from "./room";

const wss = new WebSocketServer.Server({ port: 8080 });
const roomManager = new RoomManager();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    await handelIncommingUser(JSON.parse(data.toString()), ws);
    console.log("func");
  });

  ws.send("welcome you are connected to main ws server");
});

function handelIncommingUser(data: any, ws: WebSocket) {
  if (data.type == "init_room") {
    roomManager.initRoom(data.streamsId, data, ws);
  } else if (data.type == "add_song") {
    roomManager.addSong(data.streamsId, data, ws);
  } else if (data.type == "delete_song") {
    roomManager.deleteSong(data.streamsId, data, ws);
  } else if (data.type == "upvote_song") {
    roomManager.upVoteSong(data.userId, data.streamsId, data, ws);
  } else if (data.type == "downvote_song") {
    roomManager.downVoteSong(data.userId, data.streamsId, data, ws);
  } else {
    roomManager.leaveRoom(data.streamsId, data, ws);
  }
}

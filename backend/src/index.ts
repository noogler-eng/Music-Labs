import { Server, Socket } from "socket.io";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import RoomManager from "./room";
import authRouter from "./authRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

const roomManager = new RoomManager();

app.get("/", (req, res) => {
  res.json({
    msg: "server is working an currently in express server",
  });
});

app.use(authRouter);

io.on("connection", function connection(socket: Socket) {
  socket.on("error", console.error);

  socket.on("message", async function message(data) {
    await handelIncommingUser(data, socket);
  });
  console.log("someone is connected");
});

function handelIncommingUser(data: any, ws: Socket) {
  if (data.type == "init_room") {
    console.log("init_room");
    // data = {streamId: "", userId: "", type: "init_room"}
    roomManager.initRoom(data.streamId, { userId: data.userId }, ws);
  } else if (data.type == "add_song") {
    console.log("add_song");
    // data = {streamId: "", url: "", type: "add_song"}
    roomManager.addSong(data.streamId, { url: data.url });
  } else if (data.type == "delete_song") {
    console.log("delete_song");
    // data = {streamId: "", id: string, type: "delete_song"}
    roomManager.deleteSong(data.streamId, { id: data.id });
  } else if (data.type == "vote_song") {
    roomManager.voteSong(data.streamId, {
      userId: data.userId,
      songId: data.songId,
    });
  } else {
    console.log("leave_room");
    roomManager.leaveRoom(data.streamsId, data, ws);
  }
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("server running at: ", port);
});

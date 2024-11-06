import { Server, Socket } from "socket.io";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import RoomManager from "./room";
import authRouter from "./authRoutes";

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
    await handelIncommingUser(JSON.parse(data.toString()), socket);
    console.log("func");
  });

  console.log("someone is connected");
  socket.emit("message", "welcome you are connected to main ws server");
});

function handelIncommingUser(data: any, ws: Socket) {
  if (data.type == "init_room") {
    roomManager.initRoom(data.streamsId, data, ws);
  } else if (data.type == "add_song") {
    roomManager.addSong(data.streamsId, data, ws);
  } else if (data.type == "delete_song") {
    roomManager.deleteSong(data.streamsId, data);
  } else if (data.type == "upvote_song") {
    roomManager.upVoteSong(data.userId, data.streamsId, data, ws);
  } else if (data.type == "downvote_song") {
    roomManager.downVoteSong(data.userId, data.streamsId, data, ws);
  } else {
    roomManager.leaveRoom(data.streamsId, data, ws);
  }
}

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

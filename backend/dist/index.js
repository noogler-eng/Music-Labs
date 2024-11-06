"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const room_1 = __importDefault(require("./room"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const roomManager = new room_1.default();
app.get("/", (req, res) => {
    res.json({
        msg: "server is working an currently in express server",
    });
});
app.use(authRoutes_1.default);
io.on("connection", function connection(socket) {
    socket.on("error", console.error);
    socket.on("message", function message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handelIncommingUser(JSON.parse(data.toString()), socket);
            console.log("func");
        });
    });
    console.log("someone is connected");
    socket.emit("message", "welcome you are connected to main ws server");
});
function handelIncommingUser(data, ws) {
    if (data.type == "init_room") {
        roomManager.initRoom(data.streamsId, data, ws);
    }
    else if (data.type == "add_song") {
        roomManager.addSong(data.streamsId, data, ws);
    }
    else if (data.type == "delete_song") {
        roomManager.deleteSong(data.streamsId, data);
    }
    else if (data.type == "upvote_song") {
        roomManager.upVoteSong(data.userId, data.streamsId, data, ws);
    }
    else if (data.type == "downvote_song") {
        roomManager.downVoteSong(data.userId, data.streamsId, data, ws);
    }
    else {
        roomManager.leaveRoom(data.streamsId, data, ws);
    }
}
server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});

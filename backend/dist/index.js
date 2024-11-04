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
const ws_1 = __importDefault(require("ws"));
const room_1 = __importDefault(require("./room"));
const wss = new ws_1.default.Server({ port: 8080 });
const roomManager = new room_1.default();
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield handelIncommingUser(JSON.parse(data.toString()), ws);
            console.log("func");
        });
    });
    ws.send("welcome you are connected to main ws server");
});
function handelIncommingUser(data, ws) {
    if (data.type == "init_room") {
        console.log('init...');
        roomManager.initRoom(data.streamsId, data, ws);
    }
    else if (data.type == "add_song") {
        roomManager.addSong(data.streamsId, data, ws);
    }
    else if (data.type == "delete_song") {
        roomManager.deleteSong(data.streamsId, data, ws);
    }
    else if (data.type == "upvote_song") {
        roomManager.upVoteSong(data.streamsId, data, ws);
    }
    else if (data.type == "downvote_song") {
        roomManager.downVoteSong(data.streamsId, data, ws);
    }
    else {
        roomManager.leaveRoom(data.streamsId, data, ws);
    }
}

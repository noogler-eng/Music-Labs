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
// @ts-ignore
const youtube_search_api_1 = __importDefault(require("youtube-search-api"));
const prisma_1 = __importDefault(require("./db/prisma"));
const zod_1 = require("zod");
var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const dataZod = zod_1.z.object({
    url: zod_1.z.string().includes("youtube").or(zod_1.z.string().includes("spotify")), // either has youtube or spotify
});
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    initRoom(streamsId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.rooms.get(streamsId)) {
                this.rooms.set(streamsId, {
                    wss: new ws_1.default.Server({ noServer: true }),
                    users: [],
                });
                (_a = this.rooms.get(streamsId)) === null || _a === void 0 ? void 0 : _a.users.push({
                    streamId: data.streamId,
                    ws: ws,
                });
                const songs = yield prisma_1.default.stream.findMany({
                    where: {
                        userId: streamsId,
                    },
                });
                console.log('songs: ', songs);
                if (!songs) {
                    ws.send(JSON.stringify({
                        error: "no song exists",
                    }));
                }
                else {
                    ws.send(JSON.stringify({
                        type: "init room",
                        currentSong: songs[0],
                        queueSongs: songs.slice(1, songs.length),
                    }));
                }
            }
            else {
                (_b = this.rooms.get(streamsId)) === null || _b === void 0 ? void 0 : _b.users.push({
                    streamId: data.streamId,
                    ws: ws,
                });
            }
        });
    }
    addSong(streamsId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const room = this.rooms.get(streamsId);
            if (!room)
                return;
            const isSuccess = dataZod.safeParse(data);
            const extractedId = (_a = isSuccess.data) === null || _a === void 0 ? void 0 : _a.url.split("?v=")[1];
            const isValidYTUrl = (_b = isSuccess.data) === null || _b === void 0 ? void 0 : _b.url.match(YT_REGEX);
            if (!isValidYTUrl)
                throw new Error("Invalid url");
            const videoData = yield youtube_search_api_1.default.GetVideoDetails(extractedId);
            const length = videoData.thumbnail.thumbnails.length;
            yield prisma_1.default.stream.create({
                data: {
                    userId: streamsId,
                    type: ((_c = isSuccess.data) === null || _c === void 0 ? void 0 : _c.url.includes("spotify")) ? "Spotify" : "Youtube",
                    title: (videoData === null || videoData === void 0 ? void 0 : videoData.title) || "",
                    url: ((_d = isSuccess.data) === null || _d === void 0 ? void 0 : _d.url) || "",
                    extractedId: extractedId || "",
                    smallImg: videoData.thumbnail.thumbnails[length - 2].url || "",
                    bigImg: videoData.thumbnail.thumbnails[length - 1].url || "",
                },
            });
            const songs = yield prisma_1.default.stream.findMany({
                where: {
                    userId: streamsId,
                },
            });
            room === null || room === void 0 ? void 0 : room.wss.clients.forEach((ws) => {
                ws.send(JSON.stringify({
                    type: "song added",
                    currentSong: songs[0],
                    queueSongs: songs.slice(1, songs.length),
                }));
            });
        });
    }
    deleteSong(streamsId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.rooms.get(streamsId);
            if (!room)
                return;
            yield prisma_1.default.stream.deleteMany({
                where: {
                    id: data.streamId,
                },
            });
            room === null || room === void 0 ? void 0 : room.wss.clients.forEach((ws) => {
                ws.send(JSON.stringify({
                    type: "song deleted",
                }));
            });
        });
    }
    upVoteSong(streamsId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    downVoteSong(streamsId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    leaveRoom(streamsId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.rooms.get(streamsId);
            if (!room)
                return;
            room.users = room.users.filter(user => user.ws !== ws);
            if (room.users.length === 0) {
                this.rooms.delete(streamsId);
            }
        });
    }
    broadcastToRoom(streamsId, message) {
        const room = this.rooms.get(streamsId);
        room === null || room === void 0 ? void 0 : room.wss.clients.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    }
}
exports.default = RoomManager;

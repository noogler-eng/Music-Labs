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
// @ts-ignore
const youtube_search_api_1 = __importDefault(require("youtube-search-api"));
const prisma_1 = __importDefault(require("./db/prisma"));
const zod_1 = require("zod");
var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
const dataZod = zod_1.z.object({
    url: zod_1.z.string().includes("youtube").or(zod_1.z.string().includes("spotify")),
});
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    getRoom(streamId) {
        return this.rooms.get(streamId);
    }
    initRoom(streamId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.rooms.get(streamId)) {
                this.rooms.set(streamId, {
                    wss: new socket_io_1.Server(),
                    users: [],
                });
                (_a = this.rooms.get(streamId)) === null || _a === void 0 ? void 0 : _a.users.push({
                    userId: data.userId,
                    ws: ws,
                });
            }
            else {
                (_b = this.rooms.get(streamId)) === null || _b === void 0 ? void 0 : _b.users.push({
                    userId: data.userId,
                    ws: ws,
                });
            }
            this.broadcastToRoom(streamId);
        });
    }
    addSong(streamId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const room = this.rooms.get(streamId);
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
                    userId: streamId,
                    type: ((_c = isSuccess.data) === null || _c === void 0 ? void 0 : _c.url.includes("spotify")) ? "SPOTIFY" : "YOUTUBE",
                    title: (videoData === null || videoData === void 0 ? void 0 : videoData.title) || "",
                    url: ((_d = isSuccess.data) === null || _d === void 0 ? void 0 : _d.url) || "",
                    extractedId: extractedId || "",
                    smallImg: videoData.thumbnail.thumbnails[length - 2].url || "",
                    bigImg: videoData.thumbnail.thumbnails[length - 1].url || "",
                },
            });
            yield this.broadcastToRoom(streamId);
        });
    }
    deleteSong(streamId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.rooms.get(streamId);
            if (!room)
                return;
            yield prisma_1.default.stream.deleteMany({
                where: {
                    id: data.id,
                },
            });
            yield this.broadcastToRoom(streamId);
        });
    }
    voteSong(streamId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.rooms.get(streamId);
            if (!room)
                return;
            const user = yield prisma_1.default.upvote.findFirst({
                where: {
                    userId: data.userId,
                    streamId: data.songId,
                },
            });
            // downvote it
            if (user) {
                yield prisma_1.default.upvote.deleteMany({
                    where: {
                        userId: data.userId,
                        streamId: data.songId,
                    },
                });
                yield this.broadcastToRoom(streamId);
                return;
            }
            // upvote it
            yield prisma_1.default.upvote.create({
                data: {
                    userId: data.userId,
                    streamId: data.songId,
                },
            });
            yield this.broadcastToRoom(streamId);
        });
    }
    leaveRoom(streamId, data, ws) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.rooms.get(streamId);
            if (!room)
                throw new Error("room not exists");
            ws.on("disconnect", () => {
                room.users = room.users.filter((user) => user.userId !== data.userId);
                if (room.users.length === 0) {
                    this.rooms.delete(streamId);
                }
            });
        });
    }
    broadcastToRoom(streamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.rooms.get(streamId);
            if (!room)
                return;
            const songs = yield prisma_1.default.stream.findMany({
                where: { userId: streamId },
                include: {
                    upvotes: {
                        select: {
                            userId: true,
                        },
                    },
                    _count: true,
                },
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
        });
    }
}
exports.default = RoomManager;

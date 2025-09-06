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
const prisma_1 = __importDefault(require("./db/prisma"));
const zod_1 = require("zod");
const googleapis_1 = require("googleapis");
const youtube = googleapis_1.google.youtube({
    version: "v3",
    auth: "AIzaSyDXlMo3nmJdtWNisw2a95f0G1hvMGEgrGs",
});
function getVideoDetails(videoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield youtube.videos.list({
            // @ts-ignore
            part: "snippet,contentDetails",
            id: videoId,
        });
        // @ts-ignore
        return res.data;
    });
}
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            try {
                const room = this.rooms.get(streamId);
                if (!room)
                    return;
                const isSuccess = dataZod.safeParse(data);
                const extractedId = (_a = isSuccess.data) === null || _a === void 0 ? void 0 : _a.url.split("?v=")[1];
                const isValidYTUrl = (_b = isSuccess.data) === null || _b === void 0 ? void 0 : _b.url.match(YT_REGEX);
                if (!isValidYTUrl) {
                    this.broadcastToRoom(streamId);
                    return;
                }
                const res = yield getVideoDetails(extractedId || "");
                console.log("details i am getting: ", (_c = res === null || res === void 0 ? void 0 : res.items[0]) === null || _c === void 0 ? void 0 : _c.snippet);
                if (((_e = (_d = res === null || res === void 0 ? void 0 : res.items[0]) === null || _d === void 0 ? void 0 : _d.snippet) === null || _e === void 0 ? void 0 : _e.title) === undefined) {
                    this.broadcastToRoom(streamId);
                    return;
                }
                // const videoData = await youtubesearchapi.GetVideoDetails(extractedId);
                // console.log(videoData);
                // const length = videoData?.thumbnail?.thumbnails?.length;
                yield prisma_1.default.stream.create({
                    data: {
                        userId: streamId,
                        type: ((_f = isSuccess.data) === null || _f === void 0 ? void 0 : _f.url.includes("spotify")) ? "SPOTIFY" : "YOUTUBE",
                        title: ((_h = (_g = res === null || res === void 0 ? void 0 : res.items[0]) === null || _g === void 0 ? void 0 : _g.snippet) === null || _h === void 0 ? void 0 : _h.title) || "",
                        url: ((_j = isSuccess.data) === null || _j === void 0 ? void 0 : _j.url) || "",
                        extractedId: extractedId || "",
                        smallImg: ((_o = (_m = (_l = (_k = res === null || res === void 0 ? void 0 : res.items[0]) === null || _k === void 0 ? void 0 : _k.snippet) === null || _l === void 0 ? void 0 : _l.thumbnails) === null || _m === void 0 ? void 0 : _m.default) === null || _o === void 0 ? void 0 : _o.url) || "",
                        bigImg: ((_s = (_r = (_q = (_p = res === null || res === void 0 ? void 0 : res.items[0]) === null || _p === void 0 ? void 0 : _p.snippet) === null || _q === void 0 ? void 0 : _q.thumbnails) === null || _r === void 0 ? void 0 : _r.default) === null || _s === void 0 ? void 0 : _s.url) || "",
                    },
                });
                yield this.broadcastToRoom(streamId);
            }
            catch (error) {
                console.log("Error adding song:");
                console.log(error);
            }
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
                    _count: {
                        select: {
                            upvotes: true,
                        },
                    },
                },
                orderBy: {
                    upvotes: {
                        _count: "desc",
                    },
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

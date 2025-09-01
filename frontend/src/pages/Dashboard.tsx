"use client";

import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, type Socket } from "socket.io-client";
import userAtom from "../../store/user/userAtom";
import Navbar from "../components/Navbar";
import { Input, Button, Code } from "@nextui-org/react";
import SongPlayer from "../components/SongPlayer";
import SongsList from "../components/SongList";
import {
  Copy,
  Music,
  Plus,
  SkipForward,
  Users,
  Crown,
  Zap,
  Activity,
} from "lucide-react";
import StreamInfo from "@/components/StreamInfo";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const user = useRecoilValue(userAtom);
  const [newSongUrl, setSongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queue, setQueue] = useState<any>(null);
  const [longQueue, setLongQueue] = useState([]);
  const urlRef = useRef(null);

  // this function is for adding new song in queue
  const handleAddSong = (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const urlObj = new URL(newSongUrl);
      const videoId = urlObj.searchParams.get("v");

      socket?.emit("message", {
        streamId: user?.id,
        url: videoId
          ? `https://www.youtube.com/watch?v=${videoId}`
          : newSongUrl,
        type: "add_song",
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSkipSong = async () => {
    socket?.emit("message", {
      type: "delete_song",
      id: queue.id,
      streamId: user?.id,
    });
  };

  useEffect(() => {
    if (!socket) {
      const newSocket: Socket = io(import.meta.env.VITE_SOCKET_SERVER);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("message", {
          type: "init_room",
          streamId: user?.id,
          userId: user?.id,
        });
      });

      newSocket.on("songs", (data) => {
        const parsedData = JSON.parse(data);
        setQueue(parsedData.currentSong);
        const songsWithUpvotes = parsedData.queueSongs.map((song: any) => ({
          ...song,
          upvotes: song.upvotes.map((upvote: any) => upvote.userId),
        }));
        setLongQueue(songsWithUpvotes);
      });

      newSocket.on("error", () => {
        setQueue(null);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const handleCopy = () => {
    if (urlRef.current) {
      // @ts-ignore
      navigator.clipboard.writeText(urlRef.current?.innerText);
    }
  };

  if (user?.loading) return <Loading />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-950 to-black text-white relative overflow-hidden">
      {/* Decorative BG blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      {/* Header */}
      <section className="px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-6">
            <Crown className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Host Dashboard
            </span>
          </div>

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent leading-tight mb-4">
            Music Stream Dashboard
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Manage your live stream, queue songs, and control playback like a
            pro.
          </p>

          {/* Stream ID */}
          <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-400" />
              <div className="text-left">
                <p className="text-xs text-gray-400 uppercase">Stream ID</p>
                <Code
                  ref={urlRef}
                  className="px-3 py-1 rounded-md bg-black/50 border border-white/10 text-emerald-400 font-mono text-sm"
                >
                  {user?.id}
                </Code>
              </div>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={handleCopy}
              className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10"
            >
              <Copy size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1">
            <div className="h-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg overflow-hidden flex flex-col justify-end relative">
              <div className="absolute inset-0 bg-[url('/dashHero.jpg')] bg-cover bg-center opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

              <div className="relative z-10 p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    Powered by Music
                  </span>
                </div>
                <h3 className="text-2xl font-bold">Live Stream</h3>
                <p className="text-gray-400 text-sm">
                  Share music with friends and create memories together.
                </p>
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Now Playing */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Music className="w-6 h-6 text-emerald-400" />
                  Now Playing
                </h2>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>

              {queue ? (
                <SongPlayer
                  currentSong={queue}
                  socket={socket}
                  streamId={user?.id || ""}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No song currently playing. Add a song to get started!</p>
                </div>
              )}
            </div>

            {/* Queue */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-teal-400" />
                  Queue
                </h2>
                {longQueue.length > 0 && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {longQueue.length} songs
                  </span>
                )}
              </div>

              {longQueue.length > 0 ? (
                <SongsList
                  longQueue={longQueue}
                  socket={socket}
                  streamId={user?.id || ""}
                />
              ) : (
                <p className="text-center text-gray-500 py-12">
                  Queue is empty. Songs added by listeners will appear here.
                </p>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1 space-y-8">
            {/* Add Song */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-pink-400" />
                Add Song
              </h2>
              <form onSubmit={handleAddSong} className="space-y-4">
                <Input
                  type="text"
                  variant="bordered"
                  placeholder="Paste YouTube/Spotify URL..."
                  onChange={(e: any) => setSongUrl(e.target.value)}
                  value={newSongUrl}
                  required
                  className="w-full"
                  classNames={{
                    input: "text-sm text-white placeholder-gray-400",
                    inputWrapper:
                      "bg-black/30 border border-white/10 focus-within:border-emerald-500",
                  }}
                />
                <Button
                  color="success"
                  isLoading={loading}
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  startContent={!loading && <Plus className="w-5 h-5" />}
                >
                  {loading ? "Adding..." : "Add to Queue"}
                </Button>
              </form>
            </div>

            {/* Controls */}
            {(queue || longQueue.length > 0) && (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <SkipForward className="w-5 h-5 text-purple-400" />
                  Controls
                </h2>
                <Button
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={handleSkipSong}
                >
                  Skip Current Song
                </Button>
              </div>
            )}

            {/* Stats */}
            <StreamInfo length={longQueue.length} isQueue={!!queue} />
          </div>
        </div>
      </section>
    </div>
  );
}

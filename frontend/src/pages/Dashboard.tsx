"use client";

import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, type Socket } from "socket.io-client";
import userAtom from "../../store/user/userAtom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
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
  TrendingUp,
  Activity,
} from "lucide-react";
import { Code } from "@nextui-org/react";

export default function Dashboard() {
  const user = useRecoilValue(userAtom);
  const [newSongUrl, setSongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queue, setQueue] = useState<any>(null);
  const [longQueue, setLongQueue] = useState([]);
  const urlRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

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

  const handelSkipSong = async () => {
    console.log("skipping the current song!");
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
      console.log("Socket initialized:", newSocket);

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
        const songsWithUpvotesArray = parsedData.queueSongs.map(
          (song: any) => ({
            ...song,
            upvotes: song.upvotes.map((upvote: any) => upvote.userId),
          })
        );
        setLongQueue(songsWithUpvotesArray);
      });

      newSocket.on("error", (data) => {
        console.log("Error:", data);
        setQueue(null);
      });

      return () => {
        newSocket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [user]);

  const handleCopy = () => {
    if (urlRef.current) {
      navigator.clipboard
        // @ts-ignore
        .writeText(urlRef.current?.innerText)
        .then(() => {
          alert("URL copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Enhanced Header Section with Stream ID */}
        <div className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20 rounded-full px-4 py-2 mb-6">
                <Crown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Host Dashboard
                </span>
              </div>

              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
                Music Stream Dashboard
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Control your live music stream, manage the queue, and share the
                experience with your audience
              </p>

              <div className="flex items-center justify-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-slate-700/50 max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Stream ID
                    </p>
                    <Code
                      ref={urlRef}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl font-mono text-sm font-semibold border border-blue-200/50 dark:border-blue-800/50"
                    >
                      {user?.id}
                    </Code>
                  </div>
                </div>
                <Button
                  isIconOnly
                  size="lg"
                  variant="ghost"
                  onClick={handleCopy}
                  className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-xl"
                >
                  <Copy size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Enhanced Left Panel - Hero Image */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden h-full min-h-[500px] group hover:shadow-3xl transition-all duration-500">
                  <div className="h-full bg-gradient-to-br from-blue-600 to-purple-700 bg-[url('dashHero.jpg')] bg-cover bg-center bg-no-repeat relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-700/20"></div>

                    {/* Floating elements */}
                    <div className="absolute top-6 right-6">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-medium">
                          LIVE
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 text-white">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <span className="text-sm font-medium">
                            Powered by Music
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold leading-tight">
                          Live Stream
                        </h3>
                        <p className="text-sm opacity-90 leading-relaxed">
                          Share music with friends
                          <br />
                          and create memories together
                        </p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Center Panel - Player and Queue */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {/* Enhanced Current Song Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Now Playing
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Currently streaming to your audience
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Active
                        </span>
                      </div>
                    </div>

                    {queue ? (
                      <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30">
                        <SongPlayer
                          currentSong={queue}
                          socket={socket}
                          streamId={user?.id || ""}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Music className="w-10 h-10 opacity-50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          No song currently playing
                        </h3>
                        <p className="text-sm">
                          Add a song to get your stream started!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Queue Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Queue
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Songs requested by your listeners
                        </p>
                      </div>
                      {longQueue.length > 0 && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200/50 dark:border-blue-800/50">
                            {longQueue.length} songs
                          </span>
                        </div>
                      )}
                    </div>

                    {longQueue.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                        <SongsList
                          longQueue={longQueue}
                          socket={socket}
                          streamId={user?.id || ""}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Queue is empty
                        </h3>
                        <p className="text-sm">
                          Songs added by listeners will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Right Panel - Controls */}
              <div className="lg:col-span-1">
                <div className="space-y-8">
                  {/* Enhanced Add Song Section */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-500">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Add Song
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Queue your next track
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleAddSong} className="space-y-6">
                      <Input
                        type="text"
                        variant="bordered"
                        label="Song URL"
                        placeholder="Paste YouTube or Spotify URL..."
                        onChange={(e: any) => setSongUrl(e.target.value)}
                        value={newSongUrl}
                        required
                        className="w-full"
                        classNames={{
                          input: "text-sm text-black",
                          inputWrapper:
                            "border-gray-200/50 dark:border-slate-600/50 hover:border-blue-400 focus-within:border-blue-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm",
                        }}
                      />
                      <Button
                        color="primary"
                        isLoading={loading}
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                        startContent={!loading && <Plus className="w-5 h-5" />}
                      >
                        {loading ? "Adding..." : "Add to Queue"}
                      </Button>
                    </form>
                  </div>

                  {/* Enhanced Controls Section */}
                  {(longQueue.length > 0 || queue) && (
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-500">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <SkipForward className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Controls
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage playback
                          </p>
                        </div>
                      </div>

                      <Button
                        color="secondary"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                        onClick={handelSkipSong}
                        startContent={<SkipForward className="w-5 h-5" />}
                      >
                        Skip Current Song
                      </Button>
                    </div>
                  )}

                  {/* Enhanced Stats Card */}
                  <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Stream Analytics</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                          <span className="text-blue-100 font-medium">
                            Queue Length
                          </span>
                          <span className="font-bold text-xl">
                            {longQueue.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                          <span className="text-blue-100 font-medium">
                            Now Playing
                          </span>
                          <div className="flex items-center gap-2">
                            {queue && (
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            )}
                            <span className="font-bold">
                              {queue ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                          <span className="text-blue-100 font-medium">
                            Stream Status
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="font-bold text-green-300">
                              Live
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

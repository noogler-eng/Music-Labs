"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, type Socket } from "socket.io-client";
import userAtom from "../../store/user/userAtom";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import SongPlayer from "../components/SongPlayer";
import SongsList from "../components/SongList";
import { Music, Plus, Users, Radio, Headphones } from "lucide-react";

export default function Stream() {
  const user = useRecoilValue(userAtom);
  const [newSongUrl, setSongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queue, setQueue] = useState<any>(null);
  const [longQueue, setLongQueue] = useState([]);
  const navigate = useNavigate();

  const params = useParams();
  const id = params?.id;

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
        streamId: id,
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

  useEffect(() => {
    if (!socket) {
      const newSocket: Socket = io(import.meta.env.VITE_SOCKET_SERVER);
      setSocket(newSocket);
      console.log("Socket initialized:", newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("message", {
          type: "init_room",
          streamId: id,
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
  }, [user, id]);

  console.log(longQueue);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-50 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Navbar />

      {/* Header Section */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Live Music Stream
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
              <Headphones className="w-4 h-4" />
              <span className="text-sm">Listening to Stream ID: </span>
              <code className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded font-mono text-sm">
                {id}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Panel - Hero Image */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden h-full min-h-[400px]">
                <div className="h-full bg-gradient-to-br from-violet-600 to-purple-700 bg-[url('dashHero.jpg')] bg-cover bg-center bg-no-repeat relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Music Stream</h3>
                    <p className="text-sm opacity-90">
                      Join the listening party
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Panel - Player and Queue */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Current Song Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Now Playing
                    </h2>
                    <div className="flex items-center gap-1 ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Live
                      </span>
                    </div>
                  </div>

                  {queue ? (
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
                      <SongPlayer
                        currentSong={queue}
                        socket={socket}
                        streamId={id || ""}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No song currently playing</p>
                      <p className="text-sm">
                        The host will start playing music soon!
                      </p>
                    </div>
                  )}
                </div>

                {/* Queue Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Up Next
                    </h2>
                    {longQueue.length > 0 && (
                      <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-sm font-medium">
                        {longQueue.length} songs
                      </span>
                    )}
                  </div>

                  {longQueue.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      <SongsList
                        longQueue={longQueue}
                        socket={socket}
                        streamId={id || ""}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-3 opacity-50" />
                      <p>No songs in queue</p>
                      <p className="text-sm">Be the first to add a song!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Add Song */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Add Song Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Request Song
                    </h2>
                  </div>

                  <form onSubmit={handleAddSong} className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <p>Add your favorite songs to the queue!</p>
                    </div>
                    <Input
                      type="text"
                      variant="bordered"
                      label="Song URL"
                      placeholder="Paste YouTube or Spotify URL..."
                      onChange={(e: any) => setSongUrl(e.target.value)}
                      value={newSongUrl}
                      required
                      className="w-full text-black"
                      classNames={{
                        input: "text-sm",
                        inputWrapper:
                          "border-gray-200 dark:border-slate-600 hover:border-violet-400 focus-within:border-violet-500",
                      }}
                    />
                    <Button
                      color="primary"
                      isLoading={loading}
                      type="submit"
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold"
                      startContent={!loading && <Plus className="w-4 h-4" />}
                    >
                      {loading ? "Adding..." : "Add to Queue"}
                    </Button>
                  </form>
                </div>

                {/* Stream Info Card */}
                <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Stream Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-violet-100">Queue Length</span>
                      <span className="font-bold">{longQueue.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-violet-100">Status</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="font-bold text-green-300">Live</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-violet-100">Now Playing</span>
                      <span className="font-bold">{queue ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                {/* Listener Guidelines */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3">
                    🎵 Listener Guidelines
                  </h3>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                    <li>• Add songs you think everyone will enjoy</li>
                    <li>• Vote on songs to help prioritize the queue</li>
                    <li>• Be respectful of other listeners</li>
                    <li>• Only the host can skip songs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

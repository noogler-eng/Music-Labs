"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, type Socket } from "socket.io-client";
import userAtom from "../../store/user/userAtom";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input, Button } from "@nextui-org/react";
import SongPlayer from "../components/SongPlayer";
import SongsList from "../components/SongList";
import { Music, Plus, Users, Radio, Headphones, Zap } from "lucide-react";
import StreamInfo from "@/components/StreamInfo";
import Loading from "@/components/Loading";

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
    if (!user) navigate("/");
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

  // @ts-ignore
  useEffect(() => {
    if (!socket) {
      const newSocket: Socket = io(import.meta.env.VITE_SOCKET_SERVER);
      setSocket(newSocket);

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

      newSocket.on("error", () => setQueue(null));

      return () => newSocket.disconnect();
    }
  }, [user, id]);

  if (user?.loading) return <Loading />;

  return (
    <div className="min-h-screen w-full bg-black text-purple-100 flex flex-col">
      <Navbar />

      {/* HEADER */}
      <header className="px-6 py-10 border-b border-purple-900/40 bg-neutral-950 shadow-lg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-violet-800 rounded-2xl flex items-center justify-center shadow-md shadow-purple-800/40">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-purple-200">
              Live Music Stream
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <Headphones className="w-4 h-4" />
            <span className="text-sm">Listening to Stream ID:</span>
            <code className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded font-mono text-sm">
              {id}
            </code>
          </div>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <main className="flex-1 px-2 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* LEFT SIDEBAR / HERO */}
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

          {/* CENTER PANEL */}
          <section className="lg:col-span-3 space-y-8">
            {/* NOW PLAYING */}
            <div className="bg-neutral-950 rounded-2xl border border-purple-900/50 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-700 to-violet-800 rounded-xl flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-purple-200">
                  Now Playing
                </h2>
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-medium">
                    Live
                  </span>
                </div>
              </div>

              {queue ? (
                <SongPlayer
                  currentSong={queue}
                  socket={socket}
                  streamId={id || ""}
                />
              ) : (
                <div className="text-center py-12 text-purple-500">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-semibold">
                    No song currently playing
                  </p>
                  <p className="text-sm text-purple-400">
                    The host will start soon
                  </p>
                </div>
              )}
            </div>

            {/* QUEUE */}
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
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-2 space-y-8">
            {/* ADD SONG */}
            <div className="bg-neutral-950 rounded-2xl border border-purple-900/50 shadow-lg p-6">
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
            </div>

            {/* STREAM INFO */}
            <StreamInfo length={longQueue.length} isQueue={!!queue} />

            {/* GUIDELINES */}
            <div className="bg-neutral-900 rounded-2xl border border-purple-900/40 p-6">
              <h3 className="text-lg font-bold text-purple-300 mb-3">
                🎵 Listener Guidelines
              </h3>
              <ul className="text-sm text-purple-400 space-y-2">
                <li>• Add songs everyone will enjoy</li>
                <li>• Vote on songs to shape the queue</li>
                <li>• Be respectful of others</li>
                <li>• Only the host can skip songs</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, Socket } from "socket.io-client";
import userAtom from "../../store/user/userAtom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import SongPlayer from "../components/SongPlayer";
import SongsList from "../components/SongList";
import { Copy } from "lucide-react";
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
      socket?.emit("message", {
        streamId: user?.id,
        url: newSongUrl,
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
      const newSocket: Socket = io("ws://localhost:3000");
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
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex gap-2 items-center justify-center">
        <Code ref={urlRef}>{`${user?.id}`}</Code>
        <div>
          <Copy size={16} onClick={handleCopy} />
        </div>
      </div>
      <div className="flex justify-center flex-grow p-10">
        <div className="w-1/4 flex-grow p-4 bg-[url('dashHero.jpg')] bg-clip-content bg-origin-content bg-center bg-no-repeat bg-cover"></div>
        <div className="w-2/4 flex-grow p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="place-self-start text-3xl mb-1">Song</h2>
            {queue && (
              <SongPlayer
                currentSong={queue}
                socket={socket}
                streamId={user?.id || ""}
              />
            )}
            <h2 className="place-self-start mt-4 mb-1 text-3xl">Song Queue</h2>
            {longQueue && (
              <SongsList
                longQueue={longQueue}
                socket={socket}
                streamId={user?.id || ""}
              />
            )}
          </div>
        </div>
        <div className="w-1/4 flex flex-grow flex-col gap-2 p-4">
          <form onSubmit={handleAddSong} className="flex flex-col gap-2">
            <h2 className="place-self-start text-3xl mb-1">Add Song</h2>
            <Input
              type="text"
              variant={"flat"}
              label="text"
              onChange={(e: any) => setSongUrl(e.target.value)}
              value={newSongUrl}
              required
              className="w-full"
            />
            <Button
              color="primary"
              isLoading={loading}
              type="submit"
              className="w-full"
            >
              Add Song
            </Button>
          </form>
          {(longQueue.length > 0 || queue) && (
            <Button color="primary" className="w-full" onClick={handelSkipSong}>
              next Song
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

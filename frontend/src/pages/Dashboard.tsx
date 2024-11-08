import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, Socket } from "socket.io-client";
import userAtom from "../../store/user/userAtom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import SongPlayer from "../components/SongPlayer";
import SongsList from "../components/SongList";

export default function Dashboard() {
  const user = useRecoilValue(userAtom);
  const [newSongUrl, setSongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [queue, setQueue] = useState<any>(null);
  const [longQueue, setLongQueue] = useState([]);
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

  console.log(longQueue);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex justify-center flex-grow p-10">
        <div className="w-1/4 flex-grow p-4"></div>
        <div className="w-2/4 flex-grow p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="place-self-start text-3xl mb-1">Song</h2>
            {queue && <SongPlayer currentSong={queue} socket={socket} />}
            <h2 className="place-self-start mt-4 mb-1 text-3xl">Song Queue</h2>
            {longQueue && <SongsList longQueue={longQueue} socket={socket} />}
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
          {longQueue.length > 0 && (
            <Button color="primary" className="w-full" onClick={handelSkipSong}>
              next Song
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

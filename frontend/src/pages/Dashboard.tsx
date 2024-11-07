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
  const [socket, setSocket] = useState<Socket>();
  const [queue, setQueue] = useState<any>();
  const [longQueue, setLongQueue] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const handelAddSong = (e: any) => {
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

  useEffect(() => {
    if (!socket) {
      const socket: Socket = io("ws://localhost:3000");
      setSocket(socket);

      // all the function of the web sockets
      socket.on("connect", () => {
        socket.emit("message", {
          type: "init_room",
          streamId: user?.id,
          userId: user?.id,
        });
      });

      socket.on("songs", (data) => {
        console.log(data);
        setQueue(JSON.parse(data).currentSong);
        setLongQueue(JSON.parse(data).queueSongs);
      });

      socket.on("error", (data) => {
        console.log(data);
        setQueue(null);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, user]);

  console.log("currentSong: ", queue);
  console.log("longQueues:", longQueue);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex justify-center flex-grow p-10">
        <div className="w-1/4 flex-grow p-4"></div>
        <div className="w-2/4 flex-grow p-4">
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="place-self-start text-3xl mb-1">Song </h2>
            {queue && <SongPlayer currentSong={queue} socket={socket} />}
            <h2 className="place-self-start mt-4 mb-1 text-3xl">Song Queue </h2>
            {longQueue && <SongsList longQueue={longQueue} />}
          </div>
        </div>
        <div className="w-1/4 flex flex-grow flex-col gap-2 p-4">
          <form onSubmit={handelAddSong}>
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
        </div>
      </div>
    </div>
  );
}

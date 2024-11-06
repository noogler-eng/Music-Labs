import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io, Socket } from "socket.io-client";
import userAtom from "../../store/user/userAtom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

export default function Dashboard() {
  const user = useRecoilValue(userAtom);
  const [newSongUrl, setSongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  const [queue, setQueue] = useState();
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
      socket?.emit("init", {
        type: "init",
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const socket: Socket = io("ws://localhost:3000");
    setSocket(socket);

    // all the function of the web sockets
    socket.on("connect", () => {
      console.log("frotnend connected to backend");
      socket.on("message", (data) => {
        console.log(data);
      });
    });
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <div></div>
        <div className="w-1/2 flex flex-col gap-2">
          <form onSubmit={handelAddSong}>
            <Input
              type="email"
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

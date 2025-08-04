import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../../store/user/userAtom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Input, Button, Image } from "@nextui-org/react";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [streamerId, setStreamerId] = useState("");
  const [user, setUser] = useRecoilState(userAtom);

  const handleStreams = (e: any) => {
    e.preventDefault();
    navigate(`/streams/${streamerId}`);
  };

  const handleUserData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/getUser`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      const userData = res.data.user;
      setUser({
        id: userData.id,
        name: userData.name,
        imageUrl: userData.imageUrl,
      });
    } catch (error) {
      setUser(null);
      console.error(error);
    }
  };

  useEffect(() => {
    handleUserData();
  }, []);

  const images = ["4.jpg", "5.jpg", "6.jpg", "8.jpg"];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="flex flex-col items-center px-4 py-10 gap-10">
        {/* Hero / Intro Section */}
        {!user && (
          <section className="text-center max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold text-gray-100">
              🎵 Listen Together, Wherever You Are
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Welcome to{" "}
              <span className="text-white font-semibold">StreamSync</span> — a
              real-time, low-latency collaborative music listening experience.
              Create a room, invite your friends, build song queues, and
              upvote/downvote tracks as they play — all in perfect sync.
            </p>
            <p className="text-gray-500 text-sm italic">
              No remixes. Only valid YouTube music URLs are supported.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
              {images.map((url, index) => (
                <Image
                  key={index}
                  isZoomed
                  width={260}
                  radius="lg"
                  alt={`Demo ${index + 1}`}
                  src={url}
                  className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                />
              ))}
            </div>
          </section>
        )}

        {/* Authenticated Section */}
        {user && (
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
            <Button
              className="w-full md:w-1/2 text-md font-semibold bg-gray-900 text-white hover:bg-gray-800 shadow-md"
              onClick={() => navigate("/dashboard")}
            >
              🎧 Go to Dashboard
            </Button>

            <form
              onSubmit={handleStreams}
              className="w-full md:w-1/2 flex flex-col gap-3"
            >
              <Input
                type="text"
                label="Join Room"
                placeholder="Enter Stream ID"
                className="w-full"
                classNames={{
                  inputWrapper: "bg-gray-950 border border-gray-700",
                  input: "text-white placeholder:text-gray-500",
                  label: "text-gray-300",
                }}
                value={streamerId}
                onChange={(e) => setStreamerId(e.target.value)}
                isRequired
              />
              <Button
                type="submit"
                className="w-full font-semibold bg-gray-900 text-white hover:bg-gray-800 shadow-md"
              >
                🚀 Join Stream
              </Button>
            </form>
          </div>
        )}

        {/* Info Banner */}
        <div className="w-full max-w-2xl mt-8">
          <Input
            type="text"
            disabled
            value="⚠️ Please paste only valid YouTube song URLs. Remixes are strictly prohibited."
            classNames={{
              inputWrapper: "bg-gray-950 border border-gray-800",
              input: "text-gray-500 text-sm italic",
            }}
          />
        </div>
      </div>
    </div>
  );
}

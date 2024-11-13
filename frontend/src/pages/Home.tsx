import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../../store/user/userAtom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [streamerId, setStreamerId] = useState("");

  const handelStreams = (e: any) => {
    e.preventDefault();
    navigate(`/streams/${streamerId}`);
  };

  const [user, setUser] = useRecoilState(userAtom);

  const handelUserData = async () => {
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
      console.log(error);
    }
  };

  useEffect(() => {
    handelUserData();
  }, []);

  const images = [
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "8.jpg",
  ];
  const imageArr = images.map((imageUrl, index) => {
    return (
      <div>
        <Image
          key={index}
          isZoomed
          width={'280'}
          alt="loading..."
          src={imageUrl}
        />
      </div>
    );
  });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-grow flex flex-col justify-center items-center gap-8">
        {user && (
          <div className="flex justify-between w-1/2 items-center gap-10">
            <Button
              color="primary"
              className="w-1/2"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>{" "}
            <form
              onSubmit={handelStreams}
              className="flex flex-col gap-2 items-center w-1/2"
            >
              <Input
                type="text"
                variant={"flat"}
                label="Stream-id"
                className="w-full"
                onChange={(e) => setStreamerId(e.target.value)}
                value={streamerId}
                required
              />
              <Button color="primary" type="submit" className="w-full">
                StreamIt
              </Button>
            </form>
          </div>
        )}
        {!user && (
          <div className="w-5/6 flex flex-wrap items-center justify-center gap-1">
            {imageArr}
          </div>
        )}
        <div className="flex w-1/2 flex-wrap md:flex-nowrap gap-4">
          <Input
            type="text"
            placeholder="Enter your email"
            disabled={true}
            value={
              "Please note: paste only valid youtube song URL, no remix striclty prohibited"
            }
          />
        </div>
      </div>
    </div>
  );
}

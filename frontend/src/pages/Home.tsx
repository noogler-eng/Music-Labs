import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../../store/user/userAtom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);
  const [streamerId, setStreamerId] = useState("");

  const handelUserData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getUser", {
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
      console.log(error);
    }
  };

  const handelStreams = (e: any) => {
    e.preventDefault();
    navigate(`/streams/${streamerId}`);
  };

  useEffect(() => {
    handelUserData();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-grow flex flex-col justify-center items-center">
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
      </div>
    </div>
  );
}

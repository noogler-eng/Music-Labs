import { Input } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handelSignin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!data.email || !data.password) throw new Error("Unfilled Details!");
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/signin`, data);
      const token = res.data.token;
      localStorage.setItem("token", `Bearer ${token}`);
      navigate("/");
    } catch (error) {
      console.log("error while singin: ", error);
      setData({
        email: "",
        password: "",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-2/6 min-h-screen bg-[url('Young_handsome_man.jpg')] bg-clip-content bg-origin-content bg-center bg-no-repeat bg-cover"></div>
      <div className="w-4/6 flex flex-col">
        <div className="flex justify-between px-4 py-4 w-full">
          <h2 className="text-3xl">Music-Labs</h2>
          <Link to={"/"}>Home</Link>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow gap-3">
          <h3 className="text-2xl">Sign In</h3>
          <form className="flex flex-col gap-2 w-1/2" onSubmit={handelSignin}>
            <Input
              type="email"
              variant="flat"
              label="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              value={data.email}
            />
            <Input
              type="password"
              variant="flat"
              label="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              value={data.password}
            />
            <Button
              color="primary"
              isLoading={loading}
              type="submit"
              className="w-full"
            >
              singin
            </Button>
          </form>
          <div>
            If you don't have an account? Create a new one{" "}
            <Link to={"/signup"} className="text-red-400">
              Sign Up!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

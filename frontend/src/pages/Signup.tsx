import { Input } from "@nextui-org/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import axios from "axios";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    username: string;
    email: string;
    image: File | any;
    password: string;
  }>({
    username: "",
    email: "",
    image: null,
    password: "",
  });
  const navigate = useNavigate();
  const handelSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (!data.image) throw new Error("there must be an image");
    try {
      let imageUrl = "";
      const formData = new FormData();
      formData.append("file", data.image);
      formData.append("upload_preset", "payment");

      const response = await axios.post(
        import.meta.env.VITE_ClOUDINARY_API,
        formData
      );
      imageUrl = await response.data.secure_url;

      await axios.post(`${import.meta.env.VITE_SERVER}/signup`, {
        name: data.username,
        email: data.email,
        image: imageUrl,
        password: data.password,
      });
      navigate("/");
    } catch (error) {
      console.log("error while singup: ", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-2/6 min-h-screen bg-[url('singup.jpg')] bg-clip-content bg-origin-content bg-center bg-no-repeat bg-cover"></div>
      <div className="w-4/6 flex flex-col">
        <div className="flex justify-between px-4 py-4 w-full">
          <h2 className="text-3xl">Music-Labs</h2>
          <Link to={"/"}>Home</Link>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow gap-3">
          <h3 className="text-2xl">Sign Up</h3>
          <form className="flex flex-col gap-2 w-1/2" onSubmit={handelSignup}>
            <Input
              type="text"
              variant="flat"
              label="Username"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <Input
              type="email"
              variant="flat"
              label="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <Input
              type="file"
              variant="flat"
              onChange={(e) => setData({ ...data, image: e.target.files?.[0] })}
            />
            <Input
              type="password"
              variant="flat"
              label="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <Button
              color="primary"
              isLoading={loading}
              type="submit"
              className="w-full"
            >
              signup
            </Button>
          </form>
          <div>
            If you already have an account? go to singin{" "}
            <Link to={"/signin"} className="text-red-400">
              Sign In!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    image: File | null;
    password: string;
  }>({
    username: "",
    email: "",
    image: null,
    password: "",
  });

  const navigate = useNavigate();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!data.image) throw new Error("Image is required");

      const formData = new FormData();
      formData.append("file", data.image);
      formData.append("upload_preset", "payment");

      const response = await axios.post(
        import.meta.env.VITE_ClOUDINARY_API,
        formData
      );

      const imageUrl = response.data.secure_url;

      await axios.post(`${import.meta.env.VITE_SERVER}/signup`, {
        name: data.username,
        email: data.email,
        image: imageUrl,
        password: data.password,
      });

      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left side image (hidden on mobile) */}
      <div
        className="w-1/2 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('singup.webp')" }}
      ></div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex flex-col px-8 py-12 justify-between">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">🎶 Music-Labs</h1>
          <Link to="/" className="text-gray-400 hover:text-white transition">
            Home
          </Link>
        </div>

        {/* Form */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-2xl font-semibold mb-6">Create Your Account</h2>
          <form
            onSubmit={handleSignup}
            className="w-full max-w-md space-y-4"
            encType="multipart/form-data"
          >
            <Input
              type="text"
              label="Username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              classNames={{
                inputWrapper: "bg-gray-900 border border-gray-700",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <Input
              type="email"
              label="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              classNames={{
                inputWrapper: "bg-gray-900 border border-gray-700",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setData({ ...data, image: e.target.files?.[0] || null })
                }
                className="bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-md"
                required
              />
            </div>
            <Input
              type="password"
              label="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              classNames={{
                inputWrapper: "bg-gray-900 border border-gray-700",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-gray-200 underline hover:text-white"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-xs">
          © {new Date().getFullYear()} Music-Labs. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

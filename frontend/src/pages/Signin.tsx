import { Input } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSignin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!data.email || !data.password) throw new Error("Unfilled Details!");
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/signin`,
        data
      );
      const token = res.data.token;
      localStorage.setItem("token", `Bearer ${token}`);
      navigate("/");
    } catch (error) {
      console.error("Error while signin:", error);
      setData({ email: "", password: "" });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Side Image */}
      <div
        className="w-1/2 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('Young_handsome_man.jpg')" }}
      ></div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col px-8 py-12 justify-between">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">🎵 Music-Labs</h1>
          <Link to="/" className="text-gray-400 hover:text-white transition">
            Home
          </Link>
        </div>

        {/* Sign In Form */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>
          <form onSubmit={handleSignin} className="w-full max-w-md space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              classNames={{
                inputWrapper: "bg-gray-900 border border-gray-700",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
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
              Sign In
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-gray-200 underline hover:text-white"
            >
              Sign Up
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

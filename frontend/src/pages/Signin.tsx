import { Input, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertCircle, Sparkles } from "lucide-react";
import { useRecoilState } from "recoil";
import userAtom from "../../store/user/userAtom";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  console.log(user);

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
        loading: false,
      });
    } catch (error) {
      setUser(null);
      console.error(error);
    }
  };

  const handleSignin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      if (!data.email || !data.password) throw new Error("Unfilled Details!");
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/signin`,
        data
      );
      const token = res.data.token;
      localStorage.setItem("token", `Bearer ${token}`);
      handleUserData();
      navigate("/");
    } catch (error: any) {
      console.error("Error while signin:", error);
      setErrorMsg(
        "⚠️ Unable to sign in. If this keeps happening, our free server might be offline temporarily."
      );
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
      >
        <div className="w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col px-8 py-12 justify-between relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white"
          >
            <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              MusicLabs
            </span>
          </Link>
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center flex-grow"
        >
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Sign in to continue your music journey 🎶
          </p>

          {/* Error / Warning Banner */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-900/30 border border-red-600/40 text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Sign In Form */}
          <form
            onSubmit={handleSignin}
            className="w-full max-w-md space-y-4 bg-gradient-to-br from-gray-900/70 to-gray-950/80 p-8 rounded-2xl border border-gray-800 shadow-lg shadow-purple-900/30"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              classNames={{
                inputWrapper:
                  "bg-gray-900 border border-gray-700 rounded-lg shadow-sm",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <Input
              type="password"
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              classNames={{
                inputWrapper:
                  "bg-gray-900 border border-gray-700 rounded-lg shadow-sm",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-400 underline hover:text-purple-300"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-12 text-center text-gray-600 text-xs"
        >
          © {new Date().getFullYear()}{" "}
          <span className="text-violet-400 font-semibold">MusicLabs</span>. All
          rights reserved.
        </motion.footer>
      </div>
    </div>
  );
}

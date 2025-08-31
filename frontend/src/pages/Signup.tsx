import { Input } from "@nextui-org/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    try {
      if (!data.username || !data.email || !data.password) {
        throw new Error("All fields are required.");
      }
      if (!data.image) throw new Error("Profile image is required.");

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
    } catch (error: any) {
      console.error("Error during signup:", error);
      setError(
        error.response?.data?.message || error.message || "Signup failed."
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      {/* Left side image (hidden on mobile) */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 hidden md:block bg-cover bg-center rounded-r-3xl shadow-lg"
        style={{ backgroundImage: "url('singup.webp')" }}
      ></motion.div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex flex-col px-8 py-12 justify-between">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-8"
        >
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white"
          >
            <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              MusicLabs
            </span>
          </Link>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center flex-grow"
        >
          <h2 className="text-3xl font-semibold mb-6 text-violet-400">
            Create Your Account
          </h2>

          {/* Warning/Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md mb-4 p-3 text-sm text-red-400 bg-red-900/30 border border-red-500/30 rounded-xl"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form
            onSubmit={handleSignup}
            className="w-full max-w-md space-y-4 bg-gray-900/50 p-6 rounded-2xl shadow-lg border border-gray-800"
            encType="multipart/form-data"
          >
            <Input
              type="text"
              placeholder="Username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              classNames={{
                inputWrapper:
                  "bg-gray-900 border border-gray-700 focus:border-violet-500 transition-colors rounded-xl",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <Input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              classNames={{
                inputWrapper:
                  "bg-gray-900 border border-gray-700 focus:border-violet-500 transition-colors rounded-xl",
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
                className="bg-gray-900 border border-gray-700 hover:border-violet-500 transition-colors text-white px-3 py-2 rounded-xl"
                required
              />
            </div>
            <Input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              classNames={{
                inputWrapper:
                  "bg-gray-900 border border-gray-700 focus:border-violet-500 transition-colors rounded-xl",
                input: "text-white",
                label: "text-gray-400",
              }}
              isRequired
            />
            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-violet-400 underline hover:text-violet-300 transition"
            >
              Sign In
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

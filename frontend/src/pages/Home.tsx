import { useNavigate, Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../../store/user/userAtom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AuroraText } from "@/components/magicui/aurora-text";
import { MagicCard } from "@/components/magicui/magic-card";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { Zap, Vote, Shield, Clock, Palette, Rocket } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [streamerId, setStreamerId] = useState("");
  // @ts-ignore
  const [user, setUser] = useRecoilState(userAtom);

  const handleStreams = (e: any) => {
    e.preventDefault();
    navigate(`/streams/${streamerId}`);
  };

  const images = ["4.jpg", "5.jpg", "6.jpg", "8.jpg"];

  const features = [
    {
      title: "Real-time Sync",
      description:
        "Everyone hears the same song, at the same second — perfectly synchronized.",
      icon: <Zap className="w-10 h-10 text-white" />,
      gradient: "from-purple-600 to-blue-600",
    },
    {
      title: "Song Queue Voting",
      description:
        "Add, upvote, or downvote songs democratically to shape the playlist together.",
      icon: <Vote className="w-10 h-10 text-white" />,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Secure Rooms",
      description:
        "Private or public streaming rooms — your vibe, your rules, your privacy.",
      icon: <Shield className="w-10 h-10 text-white" />,
      gradient: "from-pink-500 to-purple-600",
    },
    {
      title: "Low Latency Playback",
      description:
        "Built with speed-first APIs & WebSockets for instant responsiveness.",
      icon: <Clock className="w-10 h-10 text-white" />,
      gradient: "from-orange-500 to-red-600",
    },
    {
      title: "Beautiful Interface",
      description:
        "A sleek, immersive design crafted to enhance your music experience.",
      icon: <Palette className="w-10 h-10 text-white" />,
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  const stack = [
    { name: "React.js & Vite", icon: "⚛️" },
    { name: "YouTube API", icon: "🎵" },
    { name: "WebSockets", icon: "📡" },
    { name: "TypeScript", icon: "📘" },
    { name: "Socket.IO", icon: "🔌" },
    { name: "Recoil", icon: "🧠" },
    { name: "Node.js", icon: "⚙️" },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <InteractiveGridPattern className="opacity-20" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center px-6 py-20 gap-12 text-center max-w-5xl mx-auto">
        <AuroraText className="text-6xl md:text-7xl font-extrabold">
          🎵 Listen Together, Wherever You Are
        </AuroraText>
        <p className="text-gray-300 text-lg leading-relaxed">
          Welcome to{" "}
          <span className="text-white font-semibold">StreamSync</span> — the{" "}
          <span className="text-purple-400 font-medium">real-time</span>,
          low-latency collaborative music experience. Invite your friends, build
          song queues, and vibe in perfect sync.
        </p>
        <p className="text-gray-500 text-sm italic">
          ⚠️ Only valid YouTube music URLs are supported. No remixes.
        </p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-6"
        >
          {images.map((url, index) => (
            <motion.img
              key={index}
              whileHover={{ scale: 1.08, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              src={url}
              alt={`Demo ${index + 1}`}
              className="w-60 rounded-2xl object-cover grayscale hover:grayscale-0 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-500"
            />
          ))}
        </motion.div>
      </div>

      {/* Authenticated Section */}
      {user?.name && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 py-10"
        >
          {/* Dashboard Card */}
          <MagicCard className="rounded-3xl border border-gray-800">
            <CardContent className="p-10 py-17 flex flex-col items-center justify-center space-y-6 text-center bg-black">
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Your Space
              </h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Manage your playlists, streams, and profile all in one place.
              </p>
              <Button
                className="w-full text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-black rounded-2xl py-6 shadow-md"
                onClick={() => navigate("/dashboard")}
              >
                🎧 Go to Dashboard
              </Button>
            </CardContent>
          </MagicCard>

          {/* Stream Join Card */}
          <MagicCard className="rounded-3xl bg-gradient-to-br from-black to-gray-900 backdrop-blur-2xl border border-gray-800 shadow-lg !bg-transparent">
            <CardContent className="p-10 flex flex-col space-y-6 bg-black">
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
                Join a Live Stream
              </h3>
              <form onSubmit={handleStreams} className="flex flex-col gap-5">
                <Input
                  type="text"
                  placeholder="Enter Stream ID"
                  value={streamerId}
                  onChange={(e) => setStreamerId(e.target.value)}
                  required
                  className="bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 focus-visible:ring-2 focus-visible:ring-gray-600"
                />
                <Button
                  type="submit"
                  className="w-full font-semibold text-lg bg-gray-200 hover:bg-gray-300 text-black rounded-2xl py-6 shadow-md"
                >
                  🚀 Join Stream
                </Button>
              </form>
              <p className="text-xs text-gray-500 text-center">
                Note: If this feature isn’t working, the free streaming service
                may be temporarily offline.
              </p>
            </CardContent>
          </MagicCard>
        </motion.div>
      )}

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold mb-16 text-center bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
          Key Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group p-8 rounded-2xl bg-gradient-to-br from-black to-gray-900 border border-gray-800 shadow-xl hover:shadow-2xl hover:shadow-gray-900/60 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-black text-2xl font-bold shadow-md group-hover:scale-110 transition-transform">
                {f.icon}
              </div>

              {/* Title */}
              <h4 className="text-xl font-semibold mb-3 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {f.title}
              </h4>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-16 justify-center">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Built With
          </h3>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {stack.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-black to-gray-900 border border-gray-800 shadow-md hover:shadow-2xl hover:shadow-gray-900/60 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-200 text-black text-3xl font-bold shadow-md mb-4">
                {tech.icon}
              </div>

              {/* Name */}
              <p className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                {tech.name}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 text-center py-24 px-6 bg-black overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0">
          {/* Gradient glow layers */}
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-500/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-500/20 blur-[120px]" />

          {/* Texture overlay (optional) */}
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-soft-light" />
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 p-14 rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-gray-800 shadow-[0_0_80px_-20px_rgba(0,0,0,0.7)] max-w-3xl mx-auto"
        >
          {/* Icon Badge */}
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-green-400 to-emerald-500 text-black shadow-lg mx-auto mb-6">
            <Rocket className="w-7 h-7" />
          </div>

          {/* Heading */}
          <h3 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-lime-300 bg-clip-text text-transparent tracking-tight">
            Join the Movement
          </h3>

          {/* Subtext */}
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Music-Labs is free, fast, and built for people who love listening
            together. Start your journey today.
          </p>

          {/* Button */}
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-gray-200 text-black px-7 py-3 rounded-full font-semibold hover:bg-gray-300 transition shadow-md"
          >
            <Rocket className="w-5 h-5" />
            Get Started
          </Link>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}

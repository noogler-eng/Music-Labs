import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  Sparkles,
  Wrench,
  Rocket,
  Music,
  Zap,
  Shield,
  Vote,
  Clock,
  Palette,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Top Navigation */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Music-Labs
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                    Stream Together
                  </p>
                </div>
              </div>
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 dark:border-slate-700/50 hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
          {/* Enhanced Hero Section */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20 rounded-full px-6 py-3 mb-8">
              <Music className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                About Our Platform
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              About Music-Labs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A synchronized, social music experience — stream together, vibe
              together, and create unforgettable moments through the power of
              music.
            </p>
          </div>

          {/* Enhanced Mission Section */}
          <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-12 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h3>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Music-Labs was built with one purpose: to let people connect
              through music — regardless of distance. Whether you're studying
              with friends, vibing on a call, or discovering new artists —
              Music-Labs synchronizes your playlist experience in real-time,
              creating shared moments that transcend physical boundaries.
            </p>
          </section>

          {/* Enhanced Features Section */}
          <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-12 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Key Features
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/30 dark:border-blue-800/30">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Real-time Sync
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Everyone hears the same song, at the same second, creating
                    perfect synchronization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/30 dark:border-green-800/30">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Vote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Song Queue Voting
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Add, upvote, or downvote songs democratically to shape the
                    playlist together.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/30 dark:border-purple-800/30">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Secure Rooms
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Private or public streaming rooms — your vibe, your rules,
                    your privacy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200/30 dark:border-orange-800/30">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Low Latency Playback
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Built with speed-first APIs and WebSockets for instant
                    responsiveness.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200/30 dark:border-indigo-800/30 md:col-span-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Beautiful Interface
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    A modern, focused interface designed to keep you immersed in
                    the music experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Tech Stack Section */}
          <section className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 p-12 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                Built With
              </h3>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Music-Labs leverages cutting-edge technologies and modern
              frameworks to deliver a seamless experience:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "React & Vite", icon: "⚡" },
                { name: "FastAPI / Node.js", icon: "⚙️" },
                { name: "Recoil", icon: "🧠" },
                { name: "YouTube API", icon: "🎵" },
                { name: "Tailwind CSS", icon: "🪄" },
                { name: "WebSockets", icon: "📡" },
                { name: "TypeScript", icon: "📘" },
                { name: "Socket.IO", icon: "🔌" },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-700/80 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-200"
                >
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced CTA Section */}
          <section className="text-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Rocket className="w-8 h-8" />
                <h3 className="text-3xl font-bold">Join the Movement</h3>
              </div>
              <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
                Music-Labs is free, fast, and built for people who love
                listening together. Start your musical journey today.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
              >
                <Rocket className="w-5 h-5" />
                Get Started
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
          </section>
        </div>
      </div>
    </div>
  );
}

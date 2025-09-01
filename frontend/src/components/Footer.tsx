import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand / Licensing */}
        <div className="text-gray-400 text-sm text-center md:text-left">
          <p>© {new Date().getFullYear()} MusicLabs. All rights reserved.</p>
          <p className="text-gray-500 mt-1">Licensed under MIT License</p>
        </div>

        {/* Right: Social Links */}
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/sharad-poddar-895985283/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>

          <a
            href="https://github.com/noogler-eng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>

          <a
            href="mailto:poddarsharad460@gmail.com"
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

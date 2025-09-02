import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import userAtom from "../../store/user/userAtom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Navbar Rendered. User:", user);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 flex justify-between items-center 
                 px-6 py-4 border-b border-gray-800/50 
                 bg-gradient-to-r from-gray-950 via-black to-gray-950
                 backdrop-blur-md shadow-lg"
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold text-white"
      >
        <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" />
        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          MusicLabs
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex gap-3 items-center text-sm font-medium text-gray-300">
        {/* Show Home only if not on "/" */}
        {location.pathname !== "/" && (
          <Link
            to="/"
            className="relative hover:text-violet-400 transition-colors"
          >
            Home
          </Link>
        )}

        {/* Avatar */}
        {user && user.imageUrl && (
          <div
            className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg 
                  hover:bg-gray-800/50 transition-colors"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-green-500 shadow-md">
              <img
                src={user.imageUrl}
                alt={user.name || "User Avatar"}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Username */}
            <span className="text-gray-100 font-semibold tracking-wide">
              {user.name || "Guest"}
            </span>
          </div>
        )}

        {/* Auth Buttons */}
        {user?.name ? (
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
            }}
          >
            Logout
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => navigate("/signin")}>
            Login
          </Button>
        )}
      </div>
    </motion.nav>
  );
}

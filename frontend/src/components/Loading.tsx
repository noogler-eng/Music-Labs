import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* Spinner Icon */}
        <div className="flex justify-center mb-6">
          <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4">Loading...</h2>

        {/* Subtitle */}
        <p className="text-gray-400">
          Please wait while we prepare everything for you.
        </p>
      </motion.div>
    </div>
  );
}

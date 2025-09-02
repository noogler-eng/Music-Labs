import { Card, CardHeader, Button } from "@nextui-org/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../../store/user/userAtom";
import { Socket } from "socket.io-client";
import { motion } from "framer-motion";

export default function SongsList({
  longQueue,
  socket,
  streamId,
}: {
  longQueue: any;
  socket: Socket | null;
  streamId: string;
}) {
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userAtom);

  const handleVote = async (id: string) => {
    setLoading(true);
    try {
      socket?.emit("message", {
        type: "vote_song",
        songId: id,
        userId: user?.id,
        streamId,
      });
    } catch (err) {
      console.error("Vote error:", err);
    }
    setLoading(false);
  };

  return (
    <div
      className="w-full flex flex-col gap-4 h-64 overflow-y-auto pr-2 
                    scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
    >
      {longQueue.map((song: any, index: number) => {
        const isUpvoted = song?.upvotes?.includes(user?.id);
        const voteCount = song?._count?.upvotes || 0;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              shadow="sm"
              className="bg-gradient-to-br from-gray-900 to-black 
                         border border-gray-800 rounded-xl overflow-hidden 
                         hover:scale-[1.01] transition-all duration-300"
            >
              <CardHeader className="flex justify-between items-center p-3">
                {/* Left: Thumbnail + Info */}
                <div className="flex items-center gap-3">
                  {song?.bigImg ? (
                    <img
                      alt={song?.title}
                      src={song?.bigImg}
                      className="rounded-xl object-cover shadow-lg"
                      width={60}
                    />
                  ) : (
                    <img
                      alt={song?.title}
                      src={"./rainbow-icon.svg"}
                      className="rounded-xl object-cover shadow-lg"
                      width={60}
                    />
                  )}
                  <div className="flex flex-col max-w-[200px]">
                    <h4 className="text-base font-semibold truncate text-white">
                      {song.title}
                    </h4>
                    <p className="text-xs text-gray-400">YouTube</p>
                    <span className="text-xs text-gray-500 italic">
                      {voteCount} {voteCount === 1 ? "vote" : "votes"}
                    </span>
                  </div>
                </div>

                {/* Right: Vote Button */}
                <Button
                  isLoading={loading}
                  size="sm"
                  radius="sm"
                  className={`text-white font-semibold px-4 py-1 rounded-lg shadow-md
                    ${
                      isUpvoted
                        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                    } transition-all`}
                  onClick={() => handleVote(song.id)}
                >
                  {isUpvoted ? "Downvote" : "Upvote"}
                </Button>
              </CardHeader>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

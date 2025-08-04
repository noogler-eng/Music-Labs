import { Card, CardHeader, Image, Button } from "@nextui-org/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../../store/user/userAtom";
import { Socket } from "socket.io-client";

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
    <div className="w-full flex flex-col gap-3 h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      {longQueue.map((song: any, index: number) => {
        const isUpvoted = song?.upvotes?.includes(user?.id);
        const voteCount = song?._count?.upvotes || 0;

        return (
          <Card
            key={index}
            className="bg-gray-900 text-white border border-gray-800 shadow-md"
          >
            <CardHeader className="flex justify-between items-center p-3">
              {/* Left: Thumbnail + Title */}
              <div className="flex items-center gap-3">
                <Image
                  src={song.bigImg}
                  alt={song.title}
                  width={80}
                  height={60}
                  radius="sm"
                  className="object-cover"
                />
                <div className="flex flex-col">
                  <h4 className="text-md font-semibold truncate w-44">
                    {song.title}
                  </h4>
                  <p className="text-xs text-gray-400">YouTube</p>
                </div>
              </div>

              {/* Right: Vote Button */}
              <Button
                isLoading={loading}
                size="sm"
                className={`text-white font-semibold px-4 py-1 ${
                  isUpvoted
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-green-700 hover:bg-green-600"
                }`}
                onClick={() => handleVote(song.id)}
              >
                {isUpvoted ? "Downvote" : "Upvote"} ({voteCount})
              </Button>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}

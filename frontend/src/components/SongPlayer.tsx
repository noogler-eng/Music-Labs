import ReactPlayer from "react-player";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../../store/user/userAtom";

export default function SongPlayer({
  currentSong,
  socket,
  streamId,
}: {
  currentSong: any;
  socket: any;
  streamId: string;
}) {
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);

  // Handle song end (auto skip)
  const handleEndSong = () => {
    socket.emit("message", {
      type: "delete_song",
      id: currentSong.id,
      streamId,
    });
  };

  // Upvote / downvote toggle
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
      console.error("Vote failed:", err);
    }
    setLoading(false);
  };

  const isUpvoted = currentSong?.upvotes?.includes(user?.id);
  const voteCount = currentSong?._count?.upvotes || 0;

  useEffect(() => {
    console.log(currentSong.id, "currentSong.id in SongPlayer");
    // Reset loading state when current song changes
    setLoading(false);
  }, [currentSong]);

  console.log(currentSong, "currentSong in SongPlayer", currentSong?.id);

  return (
    <div className="w-full">
      <Card className="bg-gray-900 border border-gray-700 text-white shadow-lg">
        <CardHeader className="flex-col items-start px-4 pt-4 pb-2">
          <p className="text-sm uppercase tracking-wider text-gray-400 font-semibold">
            Now Playing
          </p>
          <h4 className="text-xl font-bold leading-tight">
            {currentSong?.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {currentSong?.channelTitle || "Unknown Channel"}
          </p>
        </CardHeader>
        <ReactPlayer
          key={currentSong?.id}
          url={currentSong.url}
          playing={true}
          controls={true}
          width="0"
          height="0"
          onEnded={handleEndSong}
          onError={(error) => {
            console.error("Error playing song:", currentSong.id, error);
          }}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
              },
            },
          }}
        />

        <CardBody className="flex flex-col gap-4 p-4 pt-0">
          <Image
            alt={currentSong?.title}
            src={currentSong?.bigImg}
            className="rounded-lg object-cover w-full max-w-md"
          />

          <div className="flex items-center justify-between">
            <Button
              isLoading={loading}
              onClick={() => handleVote(currentSong.id)}
              className={`px-5 py-2 text-white font-semibold rounded-md ${
                isUpvoted
                  ? "bg-red-700 hover:bg-red-600"
                  : "bg-green-700 hover:bg-green-600"
              }`}
            >
              {isUpvoted ? "Downvote" : "Upvote"} ({voteCount})
            </Button>

            <span className="text-xs text-gray-500">
              Song ID: {currentSong.id?.slice(0, 6)}...
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Hidden ReactPlayer for actual audio */}
    </div>
  );
}

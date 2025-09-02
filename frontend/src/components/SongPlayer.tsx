import ReactPlayer from "react-player";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
} from "@nextui-org/react";
import { useState } from "react";
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
  const [played, setPlayed] = useState(0);

  // Auto-skip when song ends
  const handleEndSong = () => {
    socket.emit("message", {
      type: "delete_song",
      id: currentSong.id,
      streamId,
    });
  };

  console.log(currentSong);

  // Toggle vote
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

  return (
    <div className="w-full flex justify-center">
      <Card className="bg-gray-900 border border-gray-700 text-white shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <CardHeader className="flex flex-col items-start px-5 pt-5 pb-3 border-b border-gray-800">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            🎵 Now Playing
          </span>
          <h4 className="text-2xl font-bold mt-1">{currentSong?.title}</h4>
          <p className="text-sm text-gray-400">
            {currentSong?.channelTitle || "Unknown Channel"}
          </p>
        </CardHeader>

        {/* Body */}
        <CardBody className="flex flex-col gap-5 p-5">
          {/* Song Thumbnail */}
          {currentSong?.bigImg ? (
            <img
              alt={currentSong?.title}
              src={currentSong?.bigImg}
              className="rounded-xl object-cover w-full max-h-72 shadow-lg"
            />
          ) : (
            <img
              alt={currentSong?.title}
              src={"./rainbow-icon.svg"}
              className="rounded-xl object-cover w-full max-h-72 shadow-lg"
            />
          )}

          {/* Progress bar */}
          <Progress
            value={played * 100}
            className="w-full"
            size="sm"
            color="success"
          />

          {/* Controls */}
          <div className="flex items-center justify-between mt-2">
            <Button
              isLoading={loading}
              onClick={() => handleVote(currentSong.id)}
              className={`px-5 py-2 text-white font-semibold rounded-lg transition ${
                isUpvoted
                  ? "bg-red-700 hover:bg-red-600"
                  : "bg-green-700 hover:bg-green-600"
              }`}
            >
              {isUpvoted ? "Downvote" : "Upvote"} ({voteCount})
            </Button>

            <Button
              onClick={handleEndSong}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
            >
              ⏭ Skip
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Hidden ReactPlayer for actual playback */}
      <ReactPlayer
        key={currentSong.id}
        url={currentSong.url}
        playing
        onEnded={handleEndSong}
        onProgress={({ played }) => setPlayed(played)}
        controls={false}
        width="0"
        height="0"
        config={{
          youtube: {
            playerVars: { controls: 1 },
          },
        }}
      />
    </div>
  );
}

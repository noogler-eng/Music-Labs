import ReactPlayer from "react-player";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
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
  const [loading, setLoading] = useState(false);
  const user = useRecoilValue(userAtom);

  const handleEndSong = () => {
    socket.emit("message", {
      type: "delete_song",
      id: currentSong.id,
      streamId: streamId,
    });
  };

  const handelVote = async (id: string) => {
    setLoading(true);
    try {
      socket?.emit("message", {
        type: "vote_song",
        songId: id,
        userId: user?.id,
        streamId: streamId,
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="font-bold text-large">{currentSong?.title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2 flex flex-col gap-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={currentSong.bigImg}
            width={270}
          />
          <Button
            color="primary"
            isLoading={loading}
            onClick={() => handelVote(currentSong.id)}
          >
            {currentSong?.upvotes?.includes(user?.id) ? "downvote" : "upvote"}{" "}
            {currentSong?._count?.upvotes || 0}
          </Button>
        </CardBody>
      </Card>
      <ReactPlayer
        key={currentSong.id}
        url={currentSong.url}
        playing={true}
        onEnded={handleEndSong}
        controls={false}
        width="0"
        height="0"
        config={{
          youtube: {
            playerVars: { controls: 0 },
          },
        }}
      />
    </div>
  );
}

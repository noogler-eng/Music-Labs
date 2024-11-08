import { Card, CardHeader, Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../../store/user/userAtom";
import { Socket } from "socket.io-client";

export default function SongsList({
  longQueue,
  socket,
}: {
  longQueue: any;
  socket: Socket | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const user = useRecoilValue(userAtom);

  const handelVote = async (id: string) => {
    setLoading(true);
    try {
      socket?.emit("message", {
        type: "vote_song",
        songId: id,
        userId: user?.id,
        streamId: user?.id,
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const songs = longQueue.map((song: any, index: any) => {
    return (
      <div key={index} className="w-full">
        <Card className="w-full">
          <CardHeader className="flex justify-between">
            <div className="flex gap-3">
              <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src={song.bigImg}
                width={100}
              />
              <div className="flex flex-col">
                <p className="text-md">{song.title.slice(0, 40)}</p>
                <p className="text-small text-default-500">{"YOUTUBE"}</p>
              </div>
            </div>
            <div>
              <Button
                color="primary"
                isLoading={loading}
                onClick={() => handelVote(song.id)}
              >
                {song?.upvotes?.includes(user?.id) ? "downvote" : "upvote"}{" "}
                {song?._count?.upvotes || 0}
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  });

  return (
    <div className="w-full flex flex-col gap-2 overflow-y-auto h-64">
      {songs}
    </div>
  );
}

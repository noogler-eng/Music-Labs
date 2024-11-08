import ReactPlayer from "react-player";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

export default function SongPlayer({
  currentSong,
  socket,
  streamId,
}: {
  currentSong: any;
  socket: any;
  streamId: string;
}) {
  const handleEndSong = () => {
    socket.emit("message", {
      type: "delete_song",
      id: currentSong.id,
      streamId: streamId,
    });
  };

  return (
    <div className="w-full">
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Daily Mix</p>
          <small className="text-default-500">12 Tracks</small>
          <h4 className="font-bold text-large">{currentSong?.title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={currentSong.bigImg}
            width={270}
          />
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

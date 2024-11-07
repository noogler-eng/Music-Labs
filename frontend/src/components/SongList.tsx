import { Card, CardHeader, Image } from "@nextui-org/react";

export default function SongsList({ longQueue }: { longQueue: any }) {
  const songs = longQueue.map((song: any, index: any) => {
    return (
      <div key={index} className="w-full">
        <Card className="w-full">
          <CardHeader className="flex gap-3">
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
          </CardHeader>
        </Card>
      </div>
    );
  });

  return <div className="w-full flex flex-col gap-2 overflow-y-auto h-64">{songs}</div>;
}

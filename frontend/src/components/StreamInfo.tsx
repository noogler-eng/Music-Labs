import { TrendingUp } from "lucide-react";

export default function StreamInfo({
  length,
  isQueue,
}: {
  length: number;
  isQueue: boolean;
}) {
  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-lg text-white">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Stream Analytics
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Queue Length</span>
          <span className="font-bold">{length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Now Playing</span>
          <span className="font-bold">{isQueue ? "Yes" : "No"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Status</span>
          <span className="text-emerald-200 font-semibold">Live</span>
        </div>
      </div>
    </div>
  );
}

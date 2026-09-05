import { useState } from "react";
import { Music2 } from "lucide-react";

const bars = [24, 42, 65, 38, 80, 54, 92, 62, 40, 76, 52, 88, 34, 60, 96, 46, 72, 38, 84, 58, 30, 68, 90, 48];

export default function AudioPlayer({ src, autoPlay = false }: { src: string; autoPlay?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return <div className="mt-5">
    <div className="mb-5 flex h-24 items-center gap-4 overflow-hidden rounded-2xl border border-[#d6a84b]/25 bg-[#041c16]/80 px-4" aria-hidden="true">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#d6a84b]/40 bg-[#d6a84b]/15 text-[#e7c775]"><Music2 size={25} /></span>
      <div className="flex h-16 min-w-0 flex-1 items-center justify-between gap-1">
        {bars.map((height, index) => <span key={index} className="music-beat-bar min-w-0 flex-1 rounded-full bg-gradient-to-t from-[#a67928] to-[#f2d48d]" style={{ height: height + "%", animationDuration: (650 + index % 5 * 130) + "ms", animationDelay: (-index * 95) + "ms", animationPlayState: playing ? "running" : "paused" }} />)}
      </div>
    </div>
    <audio src={src} controls autoPlay={autoPlay} className="w-full" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onWaiting={() => setPlaying(false)} onEmptied={() => setPlaying(false)} onError={() => setPlaying(false)}>
      Your browser does not support audio playback.
    </audio>
  </div>;
}

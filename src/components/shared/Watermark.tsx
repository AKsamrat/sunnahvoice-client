import { BookOpen } from "lucide-react";

export default function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 right-5 z-40 flex select-none items-center gap-2 rounded-full border border-emerald-900/10 bg-white/50 px-3 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-950/25 backdrop-blur-sm dark:border-white/10 dark:bg-black/20 dark:text-white/25"
    >
      <BookOpen size={13} />
      SunnahVoice
    </div>
  );
}

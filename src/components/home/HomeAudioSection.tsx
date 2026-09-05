import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mediaLabels } from "../../data/media";
import { useMedia } from "../../hooks/useMedia";
import MediaCard from "../media/MediaCard";

export default function HomeAudioSection() {
  const { items: audioTracks } = useMedia("audio", 6);
  const content = mediaLabels.audio;

  return (
    <section
      id="audios"
      className="relative mx-auto max-w-7xl border-t border-emerald-950/10 px-6 py-8 dark:border-white/10 md:py-10"
    >
      <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#b38632]">
            {content.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-950 dark:text-emerald-50 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-2 text-slate-500">{content.description}</p>
        </div>
        <Link
          to="/audio"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-950/15 px-5 py-2.5 text-sm font-bold text-emerald-900 transition hover:bg-emerald-950 hover:text-white dark:border-white/15 dark:text-[#e2bd69]"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {audioTracks.map((item) => (
          <MediaCard key={item.id} item={item} variant="section" />
        ))}
      </div>
    </section>
  );
}

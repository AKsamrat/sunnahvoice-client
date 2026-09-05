import ContentFilters from "../components/ContentFilters";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock3,
  Download,
  Headphones,
  Music2,
  Play,
  Radio,
  Sparkles,
  X,
} from "lucide-react";
import { downloadMedia } from "../components/media/MediaCard";
import type { MediaItem } from "../data/media";
import { usePaginatedContent } from "../hooks/usePaginatedContent";
import Pagination from "../components/Pagination";

const waveform = [
  28, 48, 74, 42, 88, 58, 36, 68, 92, 54, 32, 64, 82, 46, 72, 38, 86, 58, 34,
  76, 96, 52, 66, 40, 80, 48, 70, 90, 44, 62, 34, 78, 56, 88, 50, 70, 38, 84,
  60, 42,
];

function AudioModal({
  track,
  onClose,
}: {
  track: MediaItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#01110d]/80 p-5 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Play ${track.title}`}
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a2c24] p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#d6a84b]/20 to-transparent" />
        <button
          onClick={onClose}
          aria-label="Close audio player"
          className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/20 transition hover:bg-white/10"
        >
          <X size={19} />
        </button>

        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-[2rem] border-4 border-white/10 shadow-xl">
          <img
            src={track.cover}
            alt={track.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative mt-7 text-center">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#d6a84b]">
            {track.category}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{track.title}</h2>
          <p className="mt-1 text-sm text-white/50">{track.subtitle}</p>
        </div>

        <div className="mt-6 flex h-12 items-center justify-center gap-1 overflow-hidden">
          {waveform.map((height, index) => (
            <span
              key={index}
              className="w-1 rounded-full bg-[#d6a84b]"
              style={{
                height: `${height}%`,
                opacity: 0.45 + (index % 4) * 0.15,
              }}
            />
          ))}
        </div>

        <audio src={track.fileUrl} controls autoPlay className="mt-5 w-full">
          Your browser does not support audio playback.
        </audio>

        <button
          onClick={() => downloadMedia(track)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#d6a84b] px-6 py-3 font-bold text-emerald-950 transition hover:bg-[#e7c775]"
        >
          <Download size={18} />
          Download audio
        </button>
      </div>
    </div>
  );
}

export default function Audio() {
  const { items: tracks, loading, error, page, lastPage, total, setPage, category, query, setCategory, setQuery, clearFilters } = usePaginatedContent("audio");
  const [selectedTrack, setSelectedTrack] = useState<MediaItem | null>(null);
  const featured = tracks[0];

  return (
    <main className="audio-page-watermark min-h-screen bg-[#f4efe4] pb-12 pt-10 text-emerald-950 dark:bg-[#051713] dark:text-emerald-50">
      <section className="relative isolate overflow-hidden bg-[#062c24] px-6 py-10 text-white sm:py-16">
        <div className="audio-watermark-layer absolute inset-0 -z-10" />
        <div className="banner-star-pattern absolute inset-0 -z-10 opacity-70" />
        <div className="absolute -right-28 -top-28 -z-10 h-96 w-96 rounded-full border border-[#d6a84b]/15" />
        <div className="mx-auto grid max-w-7xl px-6 items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#e2bd69]">
              <Headphones size={15} />
              SunnahVoice listening room
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.02] sm:text-7xl">
              Press play.
              <span className="block font-serif italic text-[#e2bd69]">
                Let the heart listen.
              </span>
            </h1>
            <p className="mt-6 max-w-lg leading-7 text-emerald-50/55">
              A calm library of Qur&apos;an recitations, daily adhkar and
              meaningful audio—created for quiet moments.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/45">
              <span>
                <strong className="block text-2xl text-white">
                  {tracks.length}
                </strong>
                audio tracks
              </span>
              <span>
                <strong className="block text-2xl text-white">60+</strong>
                minutes
              </span>
              <span>
                <strong className="block text-2xl text-white">Free</strong>to
                listen
              </span>
            </div>
          </div>

          {featured && (
            <article className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[.07] p-5 shadow-2xl backdrop-blur-sm sm:p-7">
              <div className="grid items-center gap-6 sm:grid-cols-[190px_1fr]">
                <button
                  onClick={() => setSelectedTrack(featured)}
                  className="group relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[1.75rem] bg-black shadow-xl"
                >
                  <img
                    src={featured.cover}
                    alt={featured.title}
                    className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/15">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-[#d6a84b] text-emerald-950 shadow-xl transition group-hover:scale-110">
                      <Play size={22} fill="currentColor" />
                    </span>
                  </span>
                </button>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#e2bd69]">
                    Featured recitation
                  </p>
                  <h2 className="mt-3 text-3xl font-bold">{featured.title}</h2>
                  <p className="mt-2 text-white/45">{featured.subtitle}</p>
                  <div className="mt-5 flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {featured.meta}
                    </span>
                    <span>{featured.downloads} downloads</span>
                  </div>
                  <button
                    onClick={() => setSelectedTrack(featured)}
                    className="mt-6 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-emerald-950"
                  >
                    <Play size={16} fill="currentColor" />
                    Listen now
                  </button>
                </div>
              </div>
              <div className="mt-7 flex h-12 items-center gap-[4px] overflow-hidden rounded-2xl bg-black/15 px-4">
                {waveform.map((height, index) => (
                  <span
                    key={index}
                    className="min-w-[3px] flex-1 rounded-full bg-[#d6a84b]"
                    style={{
                      height: `${height}%`,
                      opacity: 0.35 + (index % 4) * 0.14,
                    }}
                  />
                ))}
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Qur’an recitations",
              text: "Slow down and listen with attention.",
              color: "bg-[#d9b866]",
            },
            {
              icon: Sparkles,
              title: "Daily adhkar",
              text: "Begin and end the day in remembrance.",
              color: "bg-[#bdd3c8]",
            },
            {
              icon: Radio,
              title: "Quiet reminders",
              text: "Short reflections for life between tasks.",
              color: "bg-[#d8c9b7]",
            },
          ].map((collection) => {
            const Icon = collection.icon;
            return (
              <article
                key={collection.title}
                className={`${collection.color} rounded-[1.75rem] p-7 text-emerald-950 transition duration-500 hover:-translate-y-1`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-950 text-[#e2bd69]">
                  <Icon size={22} />
                </span>
                <h2 className="mt-6 text-xl font-bold">{collection.title}</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-950/55">
                  {collection.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <ContentFilters type="audio" query={query} category={category} setQuery={setQuery} setCategory={setCategory} clearFilters={clearFilters} />
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#a67928]">
              <Music2 size={15} />
              Complete collection
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Choose what your heart needs.
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Click a waveform to open the player
          </p>
        </div>

        {loading && <p role="status">Loading audio...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && !tracks.length && <p>No audio matches your search or category.</p>}
        <div className="overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white/80 shadow-[0_24px_70px_rgba(4,44,36,.08)] backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="hidden border-b border-emerald-950/10 px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400 dark:border-white/10 sm:grid sm:grid-cols-[auto_minmax(230px,1fr)_minmax(180px,2fr)_auto] sm:gap-6">
            <span className="w-6">No.</span>
            <span>Track</span>
            <span>Sound wave</span>
            <span>Save</span>
          </div>
          {tracks.map((item, index) => (
            <article
              key={item.id}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-emerald-950/10 p-5 last:border-0 dark:border-white/10 sm:grid-cols-[auto_minmax(230px,1fr)_minmax(180px,2fr)_auto] sm:gap-6 sm:px-7"
            >
              <span className="hidden w-6 text-sm text-slate-400 sm:block">
                {String((page - 1) * 9 + index + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => setSelectedTrack(item)}
                className="flex min-w-0 items-center gap-4 text-left"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                  <img
                    src={item.cover}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
                    <Play size={18} fill="currentColor" />
                  </span>
                </span>
                <span className="min-w-0">
                  <strong className="block truncate">{item.title}</strong>
                  <small className="text-slate-500">
                    {item.category} · {item.meta}
                  </small>
                </span>
              </button>
              <button
                onClick={() => setSelectedTrack(item)}
                aria-label={`Play ${item.title}`}
                className="group/wave hidden h-16 items-center gap-3 rounded-2xl border border-emerald-950/5 bg-emerald-950/[.03] px-4 transition hover:bg-emerald-950/[.07] dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 sm:flex"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#d6a84b] text-emerald-950 transition group-hover/wave:scale-105">
                  <Play size={15} fill="currentColor" />
                </span>
                <span className="flex h-9 min-w-0 flex-1 items-center justify-center gap-[3px] overflow-hidden">
                  {waveform.map((height, barIndex) => (
                    <span
                      key={barIndex}
                      className="w-[3px] shrink-0 rounded-full bg-emerald-800/35 transition group-hover/wave:bg-[#b38735] dark:bg-emerald-100/25"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </span>
              </button>
              <button
                onClick={() => downloadMedia(item)}
                className="grid h-11 w-11 place-items-center rounded-full bg-emerald-950 text-white dark:bg-[#d6a84b] dark:text-emerald-950"
              >
                <Download size={17} />
              </button>
            </article>
          ))}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-6"><Pagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} /></div>
      {selectedTrack && (
        <AudioModal
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
        />
      )}
    </main>
  );
}

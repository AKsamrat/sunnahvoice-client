import ContentFilters from "../components/ContentFilters";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Download,
  Film,
  ListVideo,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { downloadMedia } from "../components/media/MediaCard";
import type { MediaItem } from "../data/media";
import { usePaginatedContent } from "../hooks/usePaginatedContent";
import Pagination from "../components/Pagination";

function VideoThumbnail({
  item,
  onPlay,
}: {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
}) {
  return (
    <article className="group min-w-0">
      <button
        onClick={() => onPlay(item)}
        className="relative block w-full overflow-hidden rounded-[1.5rem] bg-[#071a16] text-left"
      >
        <img
          src={item.cover}
          alt={item.title}
          className="aspect-video w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-[#d6a84b] group-hover:text-emerald-950">
          <Play size={19} fill="currentColor" />
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white">
          {item.meta}
        </span>
      </button>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a67928]">
            {item.category}
          </p>
          <h3 className="mt-1 truncate text-lg font-bold text-emerald-950 dark:text-white">
            {item.title}
          </h3>
          <p className="mt-1 truncate text-sm text-slate-500">
            {item.subtitle}
          </p>
        </div>
        <button
          onClick={() => downloadMedia(item)}
          aria-label={`Download ${item.title}`}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-950/10 text-emerald-950 transition hover:bg-emerald-950 hover:text-white dark:border-white/10 dark:text-white"
        >
          <Download size={16} />
        </button>
      </div>
    </article>
  );
}

export default function Videos() {
  const { items: videos, loading, error, page, lastPage, total, setPage, category, query, setCategory, setQuery, clearFilters } = usePaginatedContent("video");
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);
  const playerRef = useRef<HTMLElement>(null);

  const currentVideo = videos.find(video => video.id === activeVideo?.id) ?? videos[0];

  const playVideo = (video: MediaItem) => {
    setActiveVideo(video);
    window.setTimeout(() => {
      playerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  return (
    <main className="video-page-watermark min-h-screen bg-[#f5f1e8] pb-24 pt-20 text-emerald-950 dark:bg-[#051713] dark:text-emerald-50">
      <header className="relative overflow-hidden border-b border-emerald-950/10 px-6 py-16 dark:border-white/10">
        <div className="video-watermark-layer absolute inset-0" />
        <div className="banner-star-pattern absolute inset-0 opacity-60" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#a67928]">
              <Film size={15} />
              SunnahVoice cinema
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.03] sm:text-7xl">
              Stories that move the{" "}
              <span className="font-serif italic text-[#b38735]">heart.</span>
            </h1>
          </div>
          <p className="max-w-md leading-7 text-slate-500 dark:text-emerald-100/45">
            Watch short reminders, thoughtful stories and visual journeys in a
            focused space designed for reflection.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <ContentFilters type="video" query={query} category={category} setQuery={setQuery} setCategory={setCategory} clearFilters={clearFilters} />
        {loading && <p role="status">Loading videos...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && !videos.length && <p role="status">No videos match your search or category.</p>}
      </div>
      {currentVideo && <>
      <section ref={playerRef} className="bg-[#031a15] px-6 py-14 text-white">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#061f19] shadow-2xl lg:grid-cols-[1.45fr_.55fr]">
          <div className="relative min-h-[300px] bg-black sm:min-h-[460px]">
            <video
              key={currentVideo.id}
              src={currentVideo.fileUrl}
              poster={currentVideo.cover}
              controls
              autoPlay
              className="absolute inset-0 h-full w-full object-contain"
            >
              Your browser does not support video playback.
            </video>
          </div>

          <aside className="flex flex-col justify-between border-t border-white/10 p-7 lg:border-l lg:border-t-0 lg:p-9">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d6a84b]">
                  Now watching
                </p>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/45">
                  {currentVideo.meta}
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-tight">
                {currentVideo.title}
              </h2>
              <p className="mt-3 text-[#d6a84b]">{currentVideo.subtitle}</p>
              <p className="mt-6 leading-7 text-white/50">
                {currentVideo.description}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => downloadMedia(currentVideo)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d6a84b] px-5 py-3.5 font-bold text-emerald-950 transition hover:bg-[#e8ca82]"
              >
                <Download size={18} />
                Download video
              </button>
              <Link
                to={`/media/${currentVideo.slug ?? currentVideo.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3.5 font-semibold text-white/75 transition hover:bg-white/5"
              >
                View full details <ArrowRight size={17} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#a67928]">
              <Sparkles size={14} />
              Quick reflections
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Watch in a quiet moment
            </h2>
          </div>
          <span className="hidden text-sm text-slate-400 sm:block">
            Select any video to play above
          </span>
        </div>

        <div className="mt-9 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {videos.slice(0, 3).map((video) => (
            <VideoThumbnail key={video.id} item={video} onPlay={playVideo} />
          ))}
        </div>
      </section>

      <section className="bg-[#eae1cf] px-6 py-20 dark:bg-[#09231d]">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-950 text-[#d6a84b] dark:bg-[#d6a84b] dark:text-emerald-950">
              <ListVideo size={22} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a67928]">
                Featured collection
              </p>
              <h2 className="text-3xl font-bold">Faith in everyday life</h2>
            </div>
          </div>

          <div className="mt-10 divide-y divide-emerald-950/10 border-y border-emerald-950/10 dark:divide-white/10 dark:border-white/10">
            {videos.slice(3).map((video, index) => (
              <article
                key={video.id}
                className="grid items-center gap-5 py-6 sm:grid-cols-[50px_180px_1fr_auto]"
              >
                <span className="hidden font-serif text-3xl italic text-emerald-950/20 dark:text-white/20 sm:block">
                  {String((page - 1) * 9 + index + 4).padStart(2, "0")}
                </span>
                <button
                  onClick={() => playVideo(video)}
                  className="group relative overflow-hidden rounded-2xl bg-emerald-950"
                >
                  <img
                    src={video.cover}
                    alt={video.title}
                    className="aspect-video w-full object-cover opacity-65 transition group-hover:scale-105"
                  />
                  <span className="absolute inset-0 grid place-items-center text-white">
                    <Play size={20} fill="currentColor" />
                  </span>
                </button>
                <button
                  onClick={() => playVideo(video)}
                  className="min-w-0 text-left"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a67928]">
                    {video.category} · {video.meta}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{video.title}</h3>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {video.description}
                  </p>
                </button>
                <button
                  onClick={() => downloadMedia(video)}
                  aria-label={`Download ${video.title}`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-emerald-950/15 transition hover:bg-emerald-950 hover:text-white dark:border-white/15"
                >
                  <Download size={17} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
      </>}
      <div className="mx-auto max-w-7xl px-6"><Pagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} /></div>
    </main>
  );
}

import {
  ArrowLeft,
  Calendar,
  Download,
  Headphones,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MediaCard, { downloadMedia } from "../components/media/MediaCard";
import type { MediaItem } from "../data/media";
import { useMedia } from "../hooks/useMedia";
import { fetchMediaItem } from "../lib/api";

export default function MediaDetails() {
  const { id } = useParams();
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { items: sameTypeItems } = useMedia(item?.type);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMediaItem(id)
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f6ef] dark:bg-[#061914] dark:text-white">
        Loading media...
      </main>
    );

  if (!item)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f6ef] px-6 pt-20 text-center dark:bg-[#061914] dark:text-emerald-50">
        <div>
          <p className="text-6xl font-bold text-[#d6a84b]">404</p>
          <h1 className="mt-3 text-3xl font-bold text-emerald-950">
            Media not found
          </h1>
          <Link
            to="/"
            className="mt-7 inline-block rounded-full bg-emerald-950 px-6 py-3 text-white"
          >
            Return home
          </Link>
        </div>
      </main>
    );

  const related = sameTypeItems
    .filter((media) => media.type === item.type && media.id !== item.id)
    .slice(0, 3);
  return (
    <main className="min-h-screen bg-[#f8f6ef] pb-24 pt-28 dark:bg-[#061914] dark:text-emerald-50">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/#library"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900"
        >
          <ArrowLeft size={17} />
          Back to library
        </Link>
        <div className="grid gap-12 lg:grid-cols-[1.35fr_.65fr]">
          <div className="overflow-hidden rounded-[2rem] bg-emerald-950 shadow-2xl">
            {item.type === "image" && (
              <img
                src={item.fileUrl}
                alt={item.title}
                className="max-h-[680px] min-h-[460px] w-full object-cover"
              />
            )}
            {item.type === "video" && (
              <video
                src={item.fileUrl}
                poster={item.cover}
                controls
                className="aspect-video w-full bg-black"
              >
                Your browser does not support video.
              </video>
            )}
            {item.type === "audio" && (
              <div className="relative flex min-h-[520px] items-end overflow-hidden p-7">
                <img
                  src={item.cover}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
                <div className="relative w-full rounded-2xl border border-white/15 bg-black/25 p-5 backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-3 text-white">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d6a84b] text-emerald-950">
                      <Headphones size={20} />
                    </span>
                    <div>
                      <strong className="block">Now playing</strong>
                      <span className="text-sm text-white/60">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <audio src={item.fileUrl} controls className="w-full">
                    Your browser does not support audio.
                  </audio>
                </div>
              </div>
            )}
          </div>
          <aside className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#ad8130]">
              {item.category} · {item.type}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-emerald-950 sm:text-5xl">
              {item.title}
            </h1>
            <p className="mt-3 text-lg text-slate-500">{item.subtitle}</p>
            <p className="mt-7 leading-7 text-slate-600">{item.description}</p>
            <div className="mt-7 flex flex-wrap gap-5 border-y border-emerald-950/10 py-5 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {item.publishedAt}
              </span>
              <span className="flex items-center gap-2">
                <Download size={16} />
                {item.downloads} downloads
              </span>
              <span>{item.meta}</span>
            </div>
            <button
              onClick={() => downloadMedia(item)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-7 py-4 font-bold text-white transition hover:bg-[#b38632]"
            >
              <Download size={19} />
              Download {item.type}
            </button>
            <button
              onClick={() =>
                navigator.share?.({
                  title: item.title,
                  url: window.location.href,
                })
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-950/15 px-7 py-4 font-semibold text-emerald-950"
            >
              <Share2 size={18} />
              Share with others
            </button>
            <p className="mt-4 text-center text-xs text-slate-400">
              Free to download and share for beneficial purposes.
            </p>
          </aside>
        </div>
        {related.length > 0 && (
          <section className="mt-24">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#ad8130]">
              Continue exploring
            </p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-950">
              More {item.type}s
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((media) => (
                <MediaCard key={media.id} item={media} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

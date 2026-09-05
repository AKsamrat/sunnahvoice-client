import { useEffect, useState } from "react";
import { CheckCircle2, Download, ShieldCheck, Sparkles, X } from "lucide-react";
import type { MediaItem } from "../../data/media";
import { performMediaDownload } from "./MediaCard";

const AD_DURATION = 8;

export default function DownloadGateModal() {
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const openDownloadGate = (event: Event) => {
      const downloadEvent = event as CustomEvent<MediaItem>;
      setMedia(downloadEvent.detail);
      setSecondsLeft(AD_DURATION);
      setDownloading(false);
    };

    window.addEventListener("sunnahvoice:download-request", openDownloadGate);
    return () =>
      window.removeEventListener(
        "sunnahvoice:download-request",
        openDownloadGate,
      );
  }, []);

  useEffect(() => {
    if (!media || secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [media, secondsLeft]);

  useEffect(() => {
    if (!media) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMedia(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [media]);

  if (!media) return null;

  const adFinished = secondsLeft === 0;
  const progress = ((AD_DURATION - secondsLeft) / AD_DURATION) * 100;

  const startDownload = async () => {
    setDownloading(true);
    await performMediaDownload(media);
    setDownloading(false);
    setMedia(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#01110d]/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement before download"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#082f27] text-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#e2bd69]">
            <ShieldCheck size={16} />
            Safe download
          </div>
          <button
            onClick={() => setMedia(null)}
            aria-label="Close download window"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={17} />
          </button>
        </header>

        <div className="p-5 sm:p-7">
          <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-[1.5rem] border border-[#d6a84b]/20 bg-[#0b3a30] p-8 text-center">
            <div className="islamic-watermark-bg absolute inset-0 opacity-30" />
            <div className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-white/50">
              Advertisement
            </div>
            <div className="relative">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#d6a84b] text-emerald-950">
                <Sparkles size={25} />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[.22em] text-[#e2bd69]">
                Support beneficial media
              </p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Help SunnahVoice remain free for everyone.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-emerald-50/55">
                This short sponsor message helps us host downloadable images,
                videos and audio without charging our community.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-white/45">
                {adFinished
                  ? "Advertisement complete"
                  : "Your download is being prepared"}
              </span>
              <span className="font-bold text-[#e2bd69]">
                {adFinished ? "Ready" : `${secondsLeft}s`}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#d6a84b] transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/[.05] p-3">
            <img
              src={media.cover}
              alt=""
              className="h-14 w-16 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm">{media.title}</strong>
              <span className="text-xs capitalize text-white/40">
                {media.type} · {media.meta}
              </span>
            </div>
            {adFinished && (
              <CheckCircle2 className="text-[#d6a84b]" size={21} />
            )}
          </div>

          <button
            onClick={startDownload}
            disabled={!adFinished || downloading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#d6a84b] px-6 py-4 font-bold text-emerald-950 transition hover:bg-[#e8ca82] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
          >
            <Download size={19} />
            {downloading
              ? "Starting download..."
              : adFinished
                ? `Download ${media.type}`
                : `Please wait ${secondsLeft} seconds`}
          </button>
        </div>
      </div>
    </div>
  );
}

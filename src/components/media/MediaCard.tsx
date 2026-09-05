import { Download, Headphones, Image as ImageIcon, Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { MediaItem } from "../../data/media";
import { mediaExtension } from "../../data/media";
import { requestDownload } from "../../lib/api";

export function downloadMedia(item: MediaItem) {
  window.dispatchEvent(
    new CustomEvent("sunnahvoice:download-request", {
      detail: item,
    }),
  );
}

export async function performMediaDownload(item: MediaItem) {
  let downloadUrl = item.fileUrl;
  try {
    downloadUrl = await requestDownload(item);
  } catch {
    // Older static items can still download directly.
  }

  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error();
    const url = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${mediaExtension[item.type]}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  } catch {
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  }
}

type MediaCardProps = {
  item: MediaItem;
  variant?: "default" | "section";
};

export default function MediaCard({
  item,
  variant = "default",
}: MediaCardProps) {
  const TypeIcon =
    item.type === "image"
      ? ImageIcon
      : item.type === "video"
        ? Play
        : Headphones;
  const sectionCard = variant === "section";

  const cardClass = sectionCard
    ? item.type === "image"
      ? "group overflow-hidden rounded-t-[4rem] rounded-b-2xl border-4 border-white bg-white p-2 shadow-xl transition duration-500 hover:-translate-y-2 dark:border-white/10 dark:bg-white/10"
      : item.type === "video"
        ? "group overflow-hidden rounded-2xl border border-[#d6a84b]/20 bg-[#061914] shadow-2xl transition duration-500 hover:-translate-y-2"
        : "group grid grid-cols-[105px_1fr] overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-[#efe5ce] shadow-lg transition duration-500 hover:-translate-y-1 dark:border-white/10 dark:bg-white/10 sm:grid-cols-[135px_1fr]"
    : "group overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white shadow-[0_18px_50px_rgba(22,78,61,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-xl";

  const previewClass = sectionCard
    ? item.type === "image"
      ? "relative block aspect-[4/3] overflow-hidden rounded-t-[3.4rem] rounded-b-xl bg-emerald-950"
      : item.type === "video"
        ? "relative block aspect-video overflow-hidden bg-black"
        : "relative block h-full min-h-36 overflow-hidden bg-emerald-950"
    : "relative block aspect-[4/3] overflow-hidden bg-emerald-950";

  const contentClass =
    sectionCard && item.type === "audio"
      ? "flex min-w-0 items-center justify-between gap-3 p-4 sm:p-5"
      : "flex items-center justify-between gap-4 p-5";

  const preview =
    sectionCard && item.type === "video" ? (
      <div className={previewClass}>
        <video
          src={item.fileUrl}
          poster={item.cover}
          controls
          preload="metadata"
          className="h-full w-full object-cover"
        >
          Your browser does not support video playback.
        </video>
      </div>
    ) : (
      <Link to={`/media/${item.slug ?? item.id}`} className={previewClass}>
        <img
          src={item.cover}
          alt={item.title}
          className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-transparent to-transparent" />
        <span
          className={`${sectionCard && item.type === "audio" ? "hidden" : "flex"} absolute left-4 top-4 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-white backdrop-blur-md`}
        >
          <TypeIcon size={13} />
          {item.type}
        </span>
        {item.type !== "image" && (
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md">
            <TypeIcon size={21} />
          </span>
        )}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/35 px-3 py-1 text-xs text-white backdrop-blur">
          {item.meta}
        </span>
      </Link>
    );

  return (
    <article className={cardClass}>
      {preview}
      <div
        className={
          sectionCard && item.type === "audio"
            ? "min-w-0 p-4 sm:p-5"
            : contentClass
        }
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <Link to={`/media/${item.slug ?? item.id}`} className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[.18em] text-[#b38632]">
              {item.category}
            </p>
            <h3
              className={`truncate text-lg font-bold ${sectionCard && item.type === "video" ? "text-white" : "text-emerald-950 dark:text-emerald-50"}`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-1 truncate text-sm ${sectionCard && item.type === "video" ? "text-white/45" : "text-slate-500"}`}
            >
              {item.subtitle}
            </p>
          </Link>
          <button
            onClick={() => downloadMedia(item)}
            aria-label={`Download ${item.title}`}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:bg-[#c49235] ${sectionCard && item.type === "video" ? "bg-[#d6a84b] text-emerald-950" : "bg-emerald-950 text-white dark:bg-[#d6a84b] dark:text-emerald-950"}`}
          >
            <Download size={18} />
          </button>
        </div>
        {sectionCard && item.type === "audio" && (
          <audio
            src={item.fileUrl}
            controls
            preload="metadata"
            className="mt-3 h-9 w-full"
          >
            Your browser does not support audio playback.
          </audio>
        )}
      </div>
    </article>
  );
}

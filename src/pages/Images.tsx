import ContentFilters from "../components/ContentFilters";
import {
  ArrowRight,
  Download,
  Image as ImageIcon,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { downloadMedia } from "../components/media/MediaCard";
import type { MediaItem } from "../data/media";
import { usePaginatedContent } from "../hooks/usePaginatedContent";
import Pagination from "../components/Pagination";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'%3E%3Cdefs%3E%3ClinearGradient id='g' x2='1' y2='1'%3E%3Cstop stop-color='%23062c24'/%3E%3Cstop offset='1' stop-color='%23b38735'/%3E%3C/linearGradient%3E%3Cpattern id='p' width='90' height='90' patternUnits='userSpaceOnUse'%3E%3Cpath d='M45 5 55 35 85 45 55 55 45 85 35 55 5 45 35 35Z' fill='none' stroke='%23fff' stroke-opacity='.16'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='1200' height='900' fill='url(%23g)'/%3E%3Crect width='1200' height='900' fill='url(%23p)'/%3E%3C/svg%3E";

function ImagePreview({
  item,
  featured = false,
}: {
  item: MediaItem;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden bg-emerald-950 ${featured ? "min-h-[500px] rounded-[2.25rem] lg:col-span-2 lg:row-span-2" : "min-h-[330px] rounded-[1.75rem]"}`}
    >
      <img
        src={item.cover}
        alt={item.title}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#031b16] via-transparent to-black/5" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-white sm:p-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#efcf84]">
            {item.category} · {item.meta}
          </p>
          <Link
            to={`/media/${item.id}`}
            className={`mt-2 block font-bold ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}
          >
            {item.title}
          </Link>
          {featured && (
            <p className="mt-2 max-w-lg text-sm text-white/60">
              {item.subtitle}
            </p>
          )}
        </div>
        <button
          onClick={() => downloadMedia(item)}
          aria-label={`Download ${item.title}`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md transition hover:bg-[#d6a84b] hover:text-emerald-950"
        >
          <Download size={19} />
        </button>
      </div>
    </article>
  );
}

export default function Images() {
  const { items: images, loading, error, page, lastPage, total, setPage, category, query, setCategory, setQuery, clearFilters } = usePaginatedContent("image");
  const [featured, ...gallery] = images;

  return (
    <main className="image-page-watermark min-h-screen bg-[#f7f3e9] pb-10 pt-12 text-emerald-950 dark:bg-[#061914] dark:text-emerald-50">
      <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#efe7d7] px-6 py-20 dark:border-white/10 dark:bg-[#09231d]">
        <div className="image-watermark-layer absolute inset-0" />
        <div className="banner-star-pattern absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#a67928]">
              <ImageIcon size={15} />
              Visual collection
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] italic sm:text-7xl">
              Sacred moments,
              <br />
              <span className="text-[#b38735]">beautifully captured.</span>
            </h1>
            <p className="mt-6 max-w-xl leading-7 text-slate-600 dark:text-emerald-100/55">
              Explore carefully selected Islamic photography, architecture and
              wallpapers. Open any image for the full story or download it
              instantly.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-950/10 bg-white/60 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-white/5">
            <Layers3 className="text-[#b38735]" />
            <div>
              <strong className="block text-xl">{total}</strong>
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Images available
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <ContentFilters type="image" query={query} category={category} setQuery={setQuery} setCategory={setCategory} clearFilters={clearFilters} />
        {loading && <p role="status">Loading images...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && !images.length && <p>No images match your search or category.</p>}
        
        {featured && (
          <div className="grid auto-rows-[330px] gap-6 lg:grid-cols-3">
            <ImagePreview item={featured} featured />
            {gallery.map((item) => (
              <ImagePreview key={item.id} item={item} />
            ))}
          </div>
        )}
        <Pagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} />
        <div className="mt-14 flex flex-col items-center rounded-[2rem] border border-dashed border-emerald-950/15 px-6 py-10 text-center dark:border-white/15">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-[#a67928]">
            Fresh inspiration
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            More images are added regularly
          </h2>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3 font-bold text-white dark:bg-[#d6a84b] dark:text-emerald-950"
          >
            Explore all media <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

type Props = { page: number; lastPage: number; total: number; onPageChange: (page: number) => void };

export default function Pagination({ page, lastPage, total, onPageChange }: Props) {
  if (!total) return null;
  const pages = Array.from(new Set([1, page - 1, page, page + 1, lastPage])).filter(n => n >= 1 && n <= lastPage).sort((a, b) => a - b);
  const style = "rounded-full border border-emerald-950/15 px-4 py-2 text-sm font-semibold transition hover:bg-emerald-950/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38735] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/10";
  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button type="button" className={style} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
      {pages.map((number, index) => <span key={number} className="contents">
        {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true">&hellip;</span>}
        <button type="button" aria-label={"Page " + number} aria-current={page === number ? "page" : undefined} onClick={() => onPageChange(number)} className={style + (page === number ? " bg-[#d6a84b] text-emerald-950" : "")}>{number}</button>
      </span>)}
      <button type="button" className={style} disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>Next</button>
      <p className="w-full text-center text-sm text-slate-500" aria-live="polite">Page {page} of {lastPage} &middot; {total} results</p>
    </nav>
  );
}

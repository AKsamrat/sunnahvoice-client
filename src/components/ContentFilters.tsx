import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { apiErrorMessage, fetchCategories, type Category, type CategoryType } from "../lib/api";

type Props = {
  type: CategoryType;
  query: string;
  category: string;
  setQuery: (value: string) => void;
  setCategory: (value: string) => void;
  clearFilters: () => void;
};

export default function ContentFilters({ type, query, category, setQuery, setCategory, clearFilters }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetchCategories(type).then(items => { if (active) setCategories(items); }).catch(error => { if (active) setError(apiErrorMessage(error)); });
    return () => { active = false; };
  }, [type]);
  const categoryValue = (item: Category) => type === "blog" ? item.name : item.slug;
  const label = type === "blog" ? "articles" : type === "audio" ? "audio" : type + "s";
  return <div className="mb-8 rounded-2xl border border-emerald-950/15 bg-white p-4 text-emerald-950 dark:border-white/20 dark:bg-[#09231d] dark:text-emerald-50">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <label className="min-w-0 flex-1"><span className="mb-2 block text-sm font-semibold">Search {label}</span><span className="flex h-12 items-center gap-3 rounded-xl border border-emerald-950/25 bg-[#f7f3e9] px-4 focus-within:ring-2 focus-within:ring-[#b38735] dark:border-white/25 dark:bg-[#061914]"><Search size={18} className="shrink-0" aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={"Search " + label + "..."} className="min-w-0 w-full bg-transparent text-sm text-emerald-950 outline-none placeholder:text-slate-500 dark:text-emerald-50 dark:placeholder:text-slate-400" /></span></label>
      <label className="sm:w-64"><span className="mb-2 block text-sm font-semibold">Category</span><select value={category} onChange={event => setCategory(event.target.value)} className="h-12 w-full rounded-xl border border-emerald-950/25 bg-[#f7f3e9] px-3 text-sm text-emerald-950 outline-none focus:ring-2 focus:ring-[#b38735] dark:border-white/25 dark:bg-[#061914] dark:text-emerald-50"><option value="All">All categories</option>{category !== "All" && !categories.some(item => categoryValue(item) === category) && <option value={category}>{category}</option>}{categories.map(item => <option key={item.id} value={categoryValue(item)}>{item.name}</option>)}</select></label>
      {(query || category !== "All") && <button type="button" onClick={clearFilters} className="h-12 rounded-xl border border-emerald-950/25 px-4 text-sm font-semibold hover:bg-emerald-950/5 focus-visible:outline-2 focus-visible:outline-[#b38735] dark:border-white/25 dark:hover:bg-white/10">Clear filters</button>}
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">Could not load categories: {error}</p>}
  </div>;
}

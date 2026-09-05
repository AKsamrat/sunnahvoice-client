import ContentFilters from "../components/ContentFilters";
import { useEffect, useState } from "react";
import { apiErrorMessage, fetchCategories } from "../lib/api";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock3,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { type BlogPost } from "../data/blog";
import { usePaginatedContent } from "../hooks/usePaginatedContent";
import Pagination from "../components/Pagination";

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white shadow-[0_16px_45px_rgba(3,44,36,.06)] transition duration-500 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
      <Link
        to={`/blog/${post.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-emerald-950"
      >
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-white backdrop-blur">
          {post.category}
        </span>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {post.publishedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 size={13} />
            {post.readTime}
          </span>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-emerald-950 transition group-hover:text-[#9c7124] dark:text-emerald-50">
            {post.title}
          </h2>
        </Link>
        <p className="mt-3 line-clamp-2 leading-7 text-slate-500 dark:text-emerald-100/45">
          {post.excerpt}
        </p>
        <Link
          to={`/blog/${post.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#9c7124]"
        >
          Read article <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default function Blog() {
  const { items: blogPosts, loading, error, page, lastPage, total, setPage, category, query, setCategory, setQuery, clearFilters } = usePaginatedContent("blog");
  const articles = blogPosts;
  const [blogCategories, setBlogCategories] = useState<string[]>(["All"]);
  const [categoryError, setCategoryError] = useState("");
  useEffect(() => {
    fetchCategories("blog").then(categories => setBlogCategories(["All", ...categories.map(category => category.name)])).catch(error => setCategoryError(apiErrorMessage(error)));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f3e9] pb-24 pt-20 text-emerald-950 dark:bg-[#061914] dark:text-emerald-50">
      <section className="relative overflow-hidden bg-[#062c24] px-6 py-20 text-white">
        <div className="islamic-watermark-bg absolute inset-0 opacity-40" />
        <div className="banner-star-pattern absolute inset-0 opacity-65" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#e2bd69]">
            <BookOpen size={15} />
            SunnahVoice journal
          </p>
          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] sm:text-7xl">
              Ideas for a life of{" "}
              <span className="font-serif italic text-[#e2bd69]">
                faith and reflection.
              </span>
            </h1>
            <p className="max-w-md leading-7 text-emerald-50/55">
              Thoughtful articles about worship, Qur’an, character and living
              with intention in a distracted world.
            </p>
          </div>
        </div>
      </section>

     

      <section className="mx-auto max-w-7xl px-6">
        <div className="pt-6"><ContentFilters type="blog" query={query} category={category} setQuery={setQuery} setCategory={setCategory} clearFilters={clearFilters} /></div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a67928]">
                  Latest writing
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {category === "All" ? "All reflections" : category}
                </h2>
              </div>
              <span className="text-sm text-slate-400">
                {total} articles
              </span>
            </div>

            <div className="grid gap-7 md:grid-cols-2">
              {articles.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>

            {loading && <p role="status">Loading articles...</p>}
            {error && <p role="alert">{error}</p>}
            <Pagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} />
            {!loading && !error && articles.length === 0 && (
              <div className="rounded-3xl border border-dashed border-emerald-950/15 py-20 text-center text-slate-500 dark:border-white/15">
                <Sparkles className="mx-auto mb-4 text-[#b38735]" />
                No articles match your search.
              </div>
            )}
          </div>

          <aside className="space-y-7 lg:sticky lg:top-28">
            <section className="overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white dark:border-white/10 dark:bg-white/5">
              <div className="border-b border-emerald-950/10 bg-[#ece3d1] px-6 py-5 dark:border-white/10 dark:bg-white/5">
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#a67928]">
                  Explore by topic
                </p>
                <h3 className="mt-1 text-xl font-bold">Categories</h3>
              </div>
              <div className="p-3">
                {categoryError && <p role="alert" className="p-3 text-sm text-red-600">{categoryError}</p>}
                {blogCategories.map((item) => {
                  return (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${category === item ? "bg-emerald-950 text-white dark:bg-[#d6a84b] dark:text-emerald-950" : "hover:bg-emerald-950/5 dark:hover:bg-white/5"}`}
                    >
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-emerald-950/10 bg-[#062c24] p-6 text-white dark:border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#e2bd69]">
                Editor's selection
              </p>
              <h3 className="mt-1 text-xl font-bold">Featured posts</h3>
              <div className="mt-6 divide-y divide-white/10">
                {blogPosts.slice(0, 3).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group grid grid-cols-[72px_1fr] gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="relative h-16 overflow-hidden rounded-xl bg-black">
                      <img
                        src={post.image}
                        alt=""
                        className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#d6a84b] text-[9px] font-bold text-emerald-950">
                        {index + 1}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <small className="text-[9px] font-bold uppercase tracking-[.16em] text-[#d6a84b]">
                        {post.category}
                      </small>
                      <strong className="mt-1 line-clamp-2 block text-sm leading-5 transition group-hover:text-[#e2bd69]">
                        {post.title}
                      </strong>
                      <small className="mt-1 block text-white/35">
                        {post.readTime}
                      </small>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="islamic-watermark-bg overflow-hidden rounded-[1.75rem] bg-[#d6a84b] p-6 text-emerald-950">
              <BookOpen size={25} />
              <h3 className="mt-5 text-2xl font-bold">Read with intention.</h3>
              <p className="mt-3 text-sm leading-6 text-emerald-950/65">
                New reflections on faith, worship and mindful living are added
                regularly.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

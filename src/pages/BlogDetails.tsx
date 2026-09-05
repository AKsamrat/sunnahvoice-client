import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Calendar,
  Clock3,
  Quote,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { BlogPost } from "../data/blog";
import { usePosts } from "../hooks/usePosts";
import { fetchPost } from "../lib/api";

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { posts: blogPosts } = usePosts();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPost(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f3e9] dark:bg-[#061914] dark:text-white">
        Loading article...
      </main>
    );

  if (!post)
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f3e9] px-6 text-center dark:bg-[#061914] dark:text-white">
        <div>
          <p className="text-6xl font-bold text-[#b38735]">404</p>
          <h1 className="mt-3 text-3xl font-bold">Article not found</h1>
          <Link
            to="/blog"
            className="mt-7 inline-block rounded-full bg-emerald-950 px-6 py-3 text-white"
          >
            Back to journal
          </Link>
        </div>
      </main>
    );

  const related = blogPosts
    .filter((article) => article.id !== post.id)
    .slice(0, 3);
  const share = () =>
    navigator.share?.({
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    });

  return (
    <main className="min-h-screen bg-[#fbf8f1] pb-24 pt-20 text-emerald-950 dark:bg-[#061914] dark:text-emerald-50">
      <header className="relative overflow-hidden bg-[#062c24] px-6 pb-32 pt-16 text-white">
        <div className="islamic-watermark-bg absolute inset-0 opacity-35" />
        <div className="banner-star-pattern absolute inset-0 opacity-65" />
        <div className="relative mx-auto max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-50/60 hover:text-[#e2bd69]"
          >
            <ArrowLeft size={17} />
            Back to journal
          </Link>
          <p className="mt-14 text-xs font-bold uppercase tracking-[.24em] text-[#e2bd69]">
            {post.category}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-emerald-50/60">
            {post.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/45">
            <span>{post.author}</span>
            <span className="flex items-center gap-2">
              <Calendar size={15} />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 size={15} />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      <article className="relative mx-auto -mt-20 max-w-5xl px-6">
        <img
          src={post.image}
          alt={post.title}
          className="aspect-[16/8] w-full rounded-[2.25rem] object-cover shadow-2xl"
        />
        <div className="mx-auto grid max-w-4xl gap-10 pt-14 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            {post.sections.map((section, index) => (
              <section key={index} className="mb-11">
                {section.heading && (
                  <h2 className="mb-5 text-3xl font-bold">{section.heading}</h2>
                )}
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mb-5 text-lg leading-9 text-slate-600 dark:text-emerald-50/60"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.quote && (
                  <blockquote className="relative my-9 overflow-hidden rounded-[2rem] bg-[#e9dfc9] p-8 dark:bg-white/5 sm:p-10">
                    <Quote className="text-[#b38735]" size={30} />
                    <p className="mt-5 font-serif text-2xl leading-relaxed italic text-emerald-950 dark:text-emerald-50">
                      {section.quote}
                    </p>
                  </blockquote>
                )}
              </section>
            ))}
          </div>
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="flex gap-2 lg:flex-col">
              <button
                onClick={share}
                aria-label="Share article"
                className="grid h-12 w-12 place-items-center rounded-full border border-emerald-950/10 bg-white text-emerald-950 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <Share2 size={18} />
              </button>
              <button
                aria-label="Save article"
                className="grid h-12 w-12 place-items-center rounded-full border border-emerald-950/10 bg-white text-emerald-950 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <Bookmark size={18} />
              </button>
            </div>
          </aside>
        </div>
      </article>

      <section className="mx-auto mt-16 max-w-7xl border-t border-emerald-950/10 px-6 pt-20 dark:border-white/10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#a67928]">
              Keep reading
            </p>
            <h2 className="mt-2 text-3xl font-bold">Related reflections</h2>
          </div>
          <Link
            to="/blog"
            className="hidden items-center gap-2 font-bold text-[#9c7124] sm:flex"
          >
            All articles <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {related.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-emerald-950">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-[#a67928]">
                {article.category}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug group-hover:text-[#9c7124]">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

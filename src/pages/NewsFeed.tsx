import { useState } from "react";
import {
  Bookmark,
  Clock3,
  Eye,
  Headphones,
  Heart,
  MessageCircle,
  Play,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type FeedPost = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  views: string;
  likes: number;
  comments: number;
  type?: "article" | "audio" | "video";
  featured?: boolean;
};

const categories = [
  "All",
  "Quran",
  "Hadith",
  "Sunnah",
  "Lifestyle",
  "Islamic History",
  "Family",
];

const posts: FeedPost[] = [
  {
    id: 1,
    title: "The Beauty of Beginning Your Day With Fajr",
    description: "Discover how the first prayer of the day can bring discipline, peace and spiritual clarity into everyday life.",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
    author: "Sunnah Voice",
    date: "06 Sep 2026",
    readTime: "6 min read",
    views: "12.4K",
    likes: 834,
    comments: 76,
    type: "article",
    featured: true,
  },
  {
    id: 2,
    title: "7 Beautiful Sunnahs You Can Practice Every Day",
    description: "Small actions inspired by the Prophet ﷺ that can become meaningful parts of your daily routine.",
    category: "Sunnah",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    author: "Sunnah Voice",
    date: "05 Sep 2026",
    readTime: "5 min read",
    views: "8.7K",
    likes: 542,
    comments: 42,
    type: "article",
  },
  {
    id: 3,
    title: "Listen: A Reflection on Surah Ar-Rahman",
    description: "A peaceful audio reflection exploring gratitude, mercy and the repeated reminder found throughout Surah Ar-Rahman.",
    category: "Quran",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    author: "Sunnah Voice",
    date: "04 Sep 2026",
    readTime: "12 min listen",
    views: "15.1K",
    likes: 1090,
    comments: 94,
    type: "audio",
  },
  {
    id: 4,
    title: "What Does Islam Teach About Good Character?",
    description: "A practical look at kindness, honesty, patience and the importance of character in a believer's life.",
    category: "Hadith",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80",
    author: "Sunnah Voice",
    date: "03 Sep 2026",
    readTime: "8 min read",
    views: "6.8K",
    likes: 406,
    comments: 31,
    type: "article",
  },
  {
    id: 5,
    title: "The Story Behind One of Islam's Greatest Civilizations",
    description: "Explore an inspiring chapter from Islamic history and the scholars, leaders and communities that shaped it.",
    category: "Islamic History",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
    author: "Sunnah Voice",
    date: "02 Sep 2026",
    readTime: "9 min read",
    views: "9.2K",
    likes: 617,
    comments: 55,
    type: "video",
  },
];

const popularPosts = [
  {
    id: 1,
    title: "Morning Adhkar: A Simple Daily Routine",
    views: "24K",
  },
  {
    id: 2,
    title: "Understanding Tawakkul in Everyday Life",
    views: "19K",
  },
  {
    id: 3,
    title: "5 Lessons From Surah Yusuf",
    views: "17K",
  },
  {
    id: 4,
    title: "Building a Peaceful Muslim Home",
    views: "14K",
  },
];

function Advertisement({ size = "large" }: { size?: "large" | "small" }) {
  return (
    <div className={"relative overflow-hidden rounded-3xl border border-dashed border-[#d8b45a]/35 bg-gradient-to-br from-[#183a2b] to-[#10271d] " + (size === "large" ? "min-h-[170px]" : "min-h-[130px]")}>
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#d8b45a]/10 blur-3xl" />

      <div className="flex h-full min-h-[inherit] items-center justify-center p-6 text-center">
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40">
            Advertisement
          </span>

          <p className="mt-3 text-sm font-medium text-white/60">
            Your advertisement can appear here
          </p>

          <p className="mt-1 text-xs text-white/30">
            Sponsored placement
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedPosts, setSavedPosts] = useState<number[]>([]);

  const toggleSave = (id: number) => setSavedPosts((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = activeCategory === "All" || post.category === activeCategory;
    const searchMatch = post.title.toLowerCase().includes(search.toLowerCase()) || post.description.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const featured = posts.find((post) => post.featured);

  return (
    <main className="min-h-screen bg-[#07150f] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#cda64b]/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d8b45a]/20 bg-[#d8b45a]/10 px-4 py-2 text-xs font-medium text-[#e9c76c]">
                <Sparkles size={14} />
                Discover & Reflect
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your Daily
                <span className="text-[#d8b45a]"> Islamic Feed</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Inspiring articles, Quran reflections, authentic reminders, Islamic history and meaningful stories for everyday life.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />

              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles..." className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#d8b45a]/50 focus:ring-2 focus:ring-[#d8b45a]/10" />
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#07150f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <button key={category} onClick={() => setActiveCategory(category)} className={"whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-medium transition " + (activeCategory === category ? "bg-[#d8b45a] text-[#102116]" : "border border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white")}>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {featured && activeCategory === "All" && !search && (
          <section className="mb-10">
            <div className="group relative grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[330px] overflow-hidden lg:min-h-[450px]">
                <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <span className="absolute left-5 top-5 rounded-full bg-[#d8b45a] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#102116]">
                  Featured
                </span>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8b45a]">
                  {featured.category}
                </span>

                <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                  {featured.title}
                </h2>

                <p className="mt-5 text-sm leading-7 text-white/50">
                  {featured.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-white/40">
                  <span>{featured.author}</span>

                  <span className="h-1 w-1 rounded-full bg-white/30" />

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {featured.readTime}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Eye size={13} />
                    {featured.views}
                  </span>
                </div>

                <button className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#d8b45a] px-6 py-3 text-sm font-semibold text-[#102116] transition hover:bg-[#efcb72]">
                  Read Story
                  <span>→</span>
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="mb-10">
          <Advertisement />
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d8b45a]">
                  Latest
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Latest Stories
                </h2>
              </div>

              <p className="text-xs text-white/40">
                {filteredPosts.length} posts
              </p>
            </div>

            <div className="space-y-5">
              {filteredPosts.map((post, index) => (
                <div key={post.id}>
                  <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-[#d8b45a]/30 hover:bg-white/[0.05]">
                    <div className="grid sm:grid-cols-[230px_1fr]">
                      <div className="relative min-h-[220px] overflow-hidden sm:min-h-full">
                        <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {post.type === "audio" && (
                          <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#d8b45a] text-[#102116]">
                            <Headphones size={18} />
                          </div>
                        )}

                        {post.type === "video" && (
                          <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#d8b45a] text-[#102116]">
                            <Play size={18} fill="currentColor" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col p-6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d8b45a]">
                            {post.category}
                          </span>

                          <button aria-label="Save post" onClick={() => toggleSave(post.id)} className={"rounded-full p-2 transition " + (savedPosts.includes(post.id) ? "bg-[#d8b45a]/20 text-[#d8b45a]" : "bg-white/5 text-white/40 hover:text-white")}>
                            <Bookmark size={17} fill={savedPosts.includes(post.id) ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <h3 className="mt-3 text-xl font-bold leading-snug transition group-hover:text-[#e2c167]">
                          {post.title}
                        </h3>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
                          {post.description}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-white/35">
                          <span>
                            {post.author}
                          </span>

                          <span>
                            •
                          </span>

                          <span>
                            {post.date}
                          </span>

                          <span>
                            •
                          </span>

                          <span>
                            {post.readTime}
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                          <div className="flex items-center gap-4 text-xs text-white/40">
                            <button className="flex items-center gap-1.5 transition hover:text-[#d8b45a]">
                              <Heart size={15} />
                              {post.likes}
                            </button>

                            <button className="flex items-center gap-1.5 transition hover:text-[#d8b45a]">
                              <MessageCircle size={15} />
                              {post.comments}
                            </button>

                            <span className="flex items-center gap-1.5">
                              <Eye size={15} />
                              {post.views}
                            </span>
                          </div>

                          <button aria-label="Share" className="rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-white">
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>

                  {index === 1 && (
                    <div className="my-6">
                      <Advertisement size="small" />
                    </div>
                  )}
                </div>
              ))}

              {!filteredPosts.length && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
                  <Search size={32} className="mx-auto text-white/20" />

                  <h3 className="mt-4 font-semibold">
                    No posts found
                  </h3>

                  <p className="mt-2 text-sm text-white/40">
                    Try searching with another keyword or category.
                  </p>
                </div>
              )}
            </div>

            <button className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-sm font-semibold text-white/70 transition hover:border-[#d8b45a]/30 hover:bg-white/[0.07] hover:text-white">
              Load More Stories
            </button>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#d8b45a]" />

                <h3 className="font-semibold">
                  Trending Now
                </h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "#Ramadan",
                  "#Quran",
                  "#Hadith",
                  "#Dua",
                  "#Sunnah",
                  "#IslamicReminder",
                ].map((tag) => (
                  <button key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/50 transition hover:border-[#d8b45a]/30 hover:text-[#d8b45a]">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <h3 className="font-semibold">
                Popular This Week
              </h3>

              <div className="mt-5 divide-y divide-white/10">
                {popularPosts.map((post, index) => (
                  <article key={post.id} className="group flex gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="text-3xl font-black text-white/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h4 className="text-sm font-semibold leading-5 transition group-hover:text-[#d8b45a]">
                        {post.title}
                      </h4>

                      <p className="mt-2 flex items-center gap-1 text-[10px] text-white/35">
                        <Eye size={11} />
                        {post.views} views
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <Advertisement size="small" />

            <div className="relative overflow-hidden rounded-3xl border border-[#d8b45a]/20 bg-gradient-to-br from-[#1d432f] to-[#10291e] p-7">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#d8b45a]/15 blur-3xl" />

              <div className="relative">
                <span className="text-2xl">
                  ✦
                </span>

                <h3 className="mt-4 text-xl font-bold">
                  Daily Reminder
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  Receive thoughtful Islamic reminders, reflections and selected stories directly in your inbox.
                </p>

                <input type="email" placeholder="Your email address" className="mt-5 w-full rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#d8b45a]/40" />

                <button className="mt-3 w-full rounded-xl bg-[#d8b45a] px-4 py-3 text-sm font-bold text-[#102116] transition hover:bg-[#ebc76e]">
                  Subscribe
                </button>

                <p className="mt-3 text-center text-[9px] text-white/25">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
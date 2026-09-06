import { useEffect, useState } from "react";
import {
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  
  Heart,
  MessageCircle,
  Quote,
  Share2,
  Sparkles,
  
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";

const article = {
  title: "The Beauty of Beginning Your Day With Fajr",
  excerpt:
    "Fajr is more than the first prayer of the day. It is an invitation to begin each morning with remembrance, discipline, gratitude and a peaceful connection with Allah.",
  category: "Lifestyle",
  author: "Sunnah Voice",
  date: "06 September 2026",
  readTime: "7 min read",
  views: "12.4K",
  likes: 834,
  comments: 76,
  image:
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=85",
};

const relatedPosts = [
  {
    id: 1,
    title: "7 Beautiful Sunnahs You Can Practice Every Day",
    category: "Sunnah",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Understanding Tawakkul in Everyday Life",
    category: "Faith",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "5 Lessons We Can Learn From Surah Yusuf",
    category: "Quran",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
  },
];

const tableOfContents = [
  "Why Fajr Is Special",
  "Beginning the Day With Remembrance",
  "Building Discipline Through Fajr",
  "Creating a Peaceful Morning Routine",
  "A Simple Fajr Routine",
];

const islamicPattern = {
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d8b45a' stroke-width='1'%3E%3Cpath d='M60 5L72 28L98 22L92 48L115 60L92 72L98 98L72 92L60 115L48 92L22 98L28 72L5 60L28 48L22 22L48 28Z'/%3E%3Ccircle cx='60' cy='60' r='22'/%3E%3Cpath d='M60 38L82 60L60 82L38 60Z'/%3E%3C/g%3E%3C/svg%3E")
  `,
  backgroundSize: "120px 120px",
};

function Advertisement({ type = "wide" }: { type?: "wide" | "box" }) {
  return (
    <div className={"relative overflow-hidden rounded-3xl border border-dashed border-[#d8b45a]/25 bg-[#10271d]/70 " + (type === "wide" ? "min-h-[150px]" : "min-h-[280px]")}>
      <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#d8b45a]/10 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.025]" style={islamicPattern} />

      <div className="relative flex h-full min-h-[inherit] items-center justify-center p-6 text-center">
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
            Advertisement
          </span>

          <p className="mt-3 text-sm font-medium text-white/55">
            Advertisement space
          </p>

          <p className="mt-1 text-[10px] text-white/25">
            Sponsored content
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ArticleDetailsPage() {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07150f] text-white">
      <div className="fixed left-0 top-0 z-50 h-[3px] bg-[#d8b45a] transition-all duration-150" style={{ width: progress + "%" }} />

      <div className="pointer-events-none fixed inset-0 opacity-[0.018]" style={islamicPattern} />

      <div className="pointer-events-none fixed -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#d8b45a]/5 blur-[150px]" />

      <div className="pointer-events-none fixed -right-40 top-[500px] h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-[150px]" />

      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 opacity-[0.035]" style={islamicPattern} />

        <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-white/40">
            <a href="/" className="transition hover:text-[#d8b45a]">
              Home
            </a>

            <ChevronRight size={13} />

            <a href="/feed" className="transition hover:text-[#d8b45a]">
              Feed
            </a>

            <ChevronRight size={13} />

            <span className="text-white/65">
              {article.category}
            </span>
          </nav>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-0 opacity-[0.025]" style={islamicPattern} />

        <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-14 text-center sm:px-6 lg:px-8 lg:pt-20">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d8b45a]/25 bg-[#d8b45a]/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e6c266]">
              <Sparkles size={13} />
              {article.category}
            </span>
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            {article.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-white/40">
            <span className="font-medium text-white/70">
              {article.author}
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {article.date}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={14} />
              {article.readTime}
            </span>

            <span className="flex items-center gap-1.5">
              <Eye size={14} />
              {article.views}
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <button onClick={() => setLiked((value) => !value)} className={"flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs transition " + (liked ? "border-[#d8b45a]/40 bg-[#d8b45a]/15 text-[#e5c160]" : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white")}>
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              {liked ? article.likes + 1 : article.likes}
            </button>

            <button onClick={() => setSaved((value) => !value)} className={"flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs transition " + (saved ? "border-[#d8b45a]/40 bg-[#d8b45a]/15 text-[#e5c160]" : "border-white/10 bg-white/[0.04] text-white/55 hover:text-white")}>
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>

            <button onClick={copyLink} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white/55 transition hover:text-white">
              <Copy size={15} />
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10">
          <img src={article.image} alt={article.title} className="h-[350px] w-full object-cover sm:h-[480px] lg:h-[620px]" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#07150f]/65 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[10px] text-white/60 backdrop-blur-xl">
            Sunnah Voice Editorial
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <Advertisement />
      </section>

      <section className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)_300px] lg:px-8">
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8b45a]">
            On this page
          </p>

          <nav className="mt-5 border-l border-white/10">
            {tableOfContents.map((item, index) => (
              <a key={item} href={"#section-" + (index + 1)} className="block border-l border-transparent px-4 py-2.5 text-xs leading-5 text-white/40 transition hover:border-[#d8b45a] hover:text-[#d8b45a]">
                {item}
              </a>
            ))}
          </nav>

          <div className="mt-8 flex gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-[#d8b45a]/30 hover:text-[#d8b45a]">
              <FaFacebook size={15} />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-[#d8b45a]/30 hover:text-[#d8b45a]">
              <BsTwitter size={15} />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-[#d8b45a]/30 hover:text-[#d8b45a]">
              <Share2 size={15} />
            </button>
          </div>
        </aside>

        <article className="min-w-0">
          <div className="prose-custom">
            <p className="text-lg leading-9 text-white/70 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[#d8b45a]">
              The quiet moments before sunrise have a character unlike any other part of the day. The world feels still, distractions are fewer, and the believer is invited to stand before Allah before the responsibilities of the day begin.
            </p>

            <div id="section-1" className="scroll-mt-28 pt-10">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Why Fajr Is Special
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-white/60">
                Fajr marks the beginning of the five daily prayers. Waking from sleep and preparing for prayer requires intention and effort, which makes the act itself a powerful reminder that worship comes before the demands of daily life.
              </p>

              <p className="mt-5 text-[15px] leading-8 text-white/60">
                For many Muslims, the atmosphere surrounding Fajr also creates a natural opportunity for reflection. There are fewer messages, meetings and responsibilities competing for attention.
              </p>
            </div>

            <div className="relative my-10 overflow-hidden rounded-3xl border border-[#d8b45a]/20 bg-[#10271d] p-7 sm:p-9">
              <div className="absolute inset-0 opacity-[0.05]" style={islamicPattern} />

              <Quote className="relative text-[#d8b45a]" size={30} />

              <blockquote className="relative mt-5 text-xl font-medium leading-9 text-white/85 sm:text-2xl">
                A peaceful morning is often built before the world becomes busy.
              </blockquote>

              <p className="relative mt-5 text-xs uppercase tracking-[0.18em] text-[#d8b45a]/70">
                Sunnah Voice Reflection
              </p>
            </div>

            <div id="section-2" className="scroll-mt-28 pt-3">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Beginning the Day With Remembrance
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-white/60">
                After Fajr, even a few minutes of Quran recitation, dhikr or quiet reflection can help establish a different tone for the day. The goal is not to create an overwhelming routine, but to build something simple enough to maintain consistently.
              </p>
            </div>

            <div className="my-10">
              <Advertisement />
            </div>

            <div id="section-3" className="scroll-mt-28">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Building Discipline Through Fajr
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-white/60">
                Consistently waking at a specific time influences many other habits. Sleeping earlier, reducing unnecessary late-night activity and planning the next morning all become connected to the goal of being awake for prayer.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  ["01", "Sleep intentionally", "Plan your evening so that waking for Fajr becomes easier."],
                  ["02", "Avoid immediate scrolling", "Protect the first few moments of the morning from distractions."],
                  ["03", "Keep Quran nearby", "Make recitation easy to begin after prayer."],
                  ["04", "Start small", "Choose a sustainable morning routine rather than an ambitious one."],
                ].map(([number, title, text]) => (
                  <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <span className="text-xs font-bold text-[#d8b45a]">
                      {number}
                    </span>

                    <h3 className="mt-3 font-semibold">
                      {title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-white/45">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div id="section-4" className="scroll-mt-28 pt-10">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Creating a Peaceful Morning Routine
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-white/60">
                A useful routine does not need to contain many activities. Prayer, remembrance, a short amount of Quran, some water and a few quiet minutes can be enough to begin the day thoughtfully.
              </p>
            </div>

            <div id="section-5" className="scroll-mt-28 pt-10">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                A Simple Fajr Routine
              </h2>

              <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
                {[
                  ["Wake", "Get up with enough time to prepare without rushing."],
                  ["Wudu", "Prepare calmly for salah."],
                  ["Fajr", "Perform the obligatory prayer."],
                  ["Adhkar", "Spend a few minutes remembering Allah."],
                  ["Quran", "Read even a small portion consistently."],
                ].map(([title, text], index) => (
                  <div key={title} className="flex gap-5 border-b border-white/10 bg-white/[0.025] p-5 last:border-b-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8b45a]/10 text-xs font-bold text-[#d8b45a]">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-white/45">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-3xl border border-[#d8b45a]/20 bg-[#d8b45a]/[0.07] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8b45a]">
                Important
              </p>

              <p className="mt-3 text-xs leading-6 text-white/50">
                Islamic rulings and practices should be learned from qualified scholars and reliable sources. Local prayer times and practices may vary depending on location and calculation methods.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setLiked((value) => !value)} className={"flex items-center gap-2 rounded-full px-4 py-2 text-xs transition " + (liked ? "bg-[#d8b45a]/15 text-[#d8b45a]" : "bg-white/[0.05] text-white/50")}>
                <Heart size={15} fill={liked ? "currentColor" : "none"} />
                Helpful
              </button>

              <button className="flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-2 text-xs text-white/50">
                <MessageCircle size={15} />
                {article.comments} Comments
              </button>
            </div>

            <button className="flex items-center gap-2 text-xs text-white/45 transition hover:text-[#d8b45a]">
              <Share2 size={15} />
              Share article
            </button>
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d8b45a] to-[#947322] text-lg font-black text-[#102116]">
                SV
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  Written by
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Sunnah Voice Editorial
                </h3>

                <p className="mt-2 text-xs leading-6 text-white/45">
                  Sharing thoughtful Islamic reminders, educational content and reflections designed to encourage learning and positive daily habits.
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <Advertisement type="box" />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="absolute inset-0 opacity-[0.025]" style={islamicPattern} />

            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8b45a]">
                Daily Reminder
              </p>

              <h3 className="mt-4 text-xl font-bold">
                Stay Inspired
              </h3>

              <p className="mt-3 text-xs leading-6 text-white/45">
                Receive selected Islamic reminders and new stories directly in your inbox.
              </p>

              <input type="email" placeholder="Email address" className="mt-5 w-full rounded-xl border border-white/10 bg-black/15 px-4 py-3 text-xs text-white outline-none placeholder:text-white/25 focus:border-[#d8b45a]/50" />

              <button className="mt-3 w-full rounded-xl bg-[#d8b45a] px-4 py-3 text-xs font-bold text-[#102116] transition hover:bg-[#e9c86c]">
                Subscribe
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8b45a]">
              Popular Topics
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Quran", "Hadith", "Dua", "Sunnah", "Prayer", "Family", "Ramadan"].map((tag) => (
                <button key={tag} className="rounded-full border border-white/10 px-3 py-2 text-[10px] text-white/45 transition hover:border-[#d8b45a]/40 hover:text-[#d8b45a]">
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="relative border-y border-white/10 bg-white/[0.015] py-16">
        <div className="absolute inset-0 opacity-[0.02]" style={islamicPattern} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8b45a]">
                Continue Reading
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Related Stories
              </h2>
            </div>

            <a href="/feed" className="hidden text-xs text-white/45 transition hover:text-[#d8b45a] sm:flex sm:items-center sm:gap-1">
              View all
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {relatedPosts.map((post) => (
              <article key={post.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0c2017] transition hover:-translate-y-1 hover:border-[#d8b45a]/30">
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#07150f]/70 to-transparent" />
                </div>

                <div className="p-5">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d8b45a]">
                    {post.category}
                  </span>

                  <h3 className="mt-3 text-lg font-bold leading-6 transition group-hover:text-[#d8b45a]">
                    {post.title}
                  </h3>

                  <p className="mt-4 flex items-center gap-1.5 text-[10px] text-white/35">
                    <Clock3 size={12} />
                    {post.readTime}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Advertisement />
      </section>
    </main>
  );
}
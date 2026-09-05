import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import HomeAudioSection from "../components/home/HomeAudioSection";
import HomeImageSection from "../components/home/HomeImageSection";
import HomeVideoSection from "../components/home/HomeVideoSection";

export default function Home() {
  return (
    <div className="islamic-watermark-bg min-h-screen bg-[#f8f6ef] text-slate-900 transition-colors dark:bg-[#061914] dark:text-emerald-50">
      <section className="relative isolate overflow-hidden bg-[#082f27] px-6 pb-14 pt-28 text-white md:pb-16 md:pt-32 ">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_30%,rgba(214,168,75,.22),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(45,134,105,.3),transparent_35%)]" />
        <div className="banner-star-pattern absolute inset-0 -z-10 opacity-70" />
        <div className="absolute -right-24 top-10 -z-10 h-96 w-96 rounded-full border border-[#d6a84b]/20" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr] px-6">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6a84b]/30 bg-[#d6a84b]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.2em] text-[#edcf8d]">
              <Sparkles size={14} />
              Faith for every moment
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Islamic inspiration,{" "}
              <span className="font-serif italic text-[#e2bd69]">
                beautifully shared.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50/70 sm:text-lg">
              Discover meaningful Islamic images, beneficial videos,
              Qur&apos;an recitations and daily reminders. Save every piece and
              carry it with you.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#images" className="inline-flex items-center gap-2 rounded-full bg-[#d6a84b] px-6 py-3.5 font-bold text-emerald-950">
                Explore library <ArrowRight size={18} />
              </a>
              <a href="#images" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold">
                <BookOpen size={18} />
                Browse categories
              </a>
            </div>
            <div className="mt-8 flex gap-8 text-sm text-emerald-100/60">
              <p><strong className="block text-2xl text-white">2.5K+</strong>media files</p>
              <p><strong className="block text-2xl text-white">100%</strong>downloadable</p>
              <p><strong className="block text-2xl text-white">Free</strong>to benefit</p>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="rotate-3 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-3 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1100&q=90" alt="The Holy Kaaba in Makkah" className="h-[360px] w-full rounded-[2rem] object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-12 max-w-xs rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <p className="font-serif text-xl italic text-[#f1d794]">
                “Indeed, in the remembrance of Allah do hearts find rest.”
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-white/55">
                Qur&apos;an 13:28
              </p>
            </div>
          </div>
        </div>
      </section>

      <HomeImageSection />
      <HomeVideoSection />
      <HomeAudioSection />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[2rem] bg-[#d9b866] px-7 py-6 text-emerald-950 md:px-14 md:py-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em]">Share the khayr</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
                Download, share and help a beautiful reminder reach someone.
              </h2>
            </div>
            <a href="#images" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-950 px-6 py-3.5 font-bold text-white">
              Browse media <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

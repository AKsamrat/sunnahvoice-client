import {
  ArrowRight,
  BookOpen,
  Download,
  Globe2,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Authenticity first",
    text: "We treat Islamic content with care, verify its context and clearly identify sources wherever possible.",
  },
  {
    icon: Heart,
    number: "02",
    title: "Benefit over noise",
    text: "Every image, video and recitation should encourage reflection, learning or sincere remembrance.",
  },
  {
    icon: Globe2,
    number: "03",
    title: "Open by design",
    text: "Beneficial media should be easy to discover, simple to download and accessible across devices.",
  },
];

const stats = [
  { value: "2.5K+", label: "Media resources" },
  { value: "40K+", label: "Monthly listeners" },
  { value: "18", label: "Countries reached" },
  { value: "100%", label: "Free downloads" },
];

export default function OurBrand() {
  return (
    <main className="overflow-hidden bg-[#f7f3e9] text-emerald-950 dark:bg-[#061914] dark:text-emerald-50">
      <section className="relative isolate min-h-[690px] overflow-hidden bg-[#062c24] px-6 pb-20 pt-36 text-white">
        <img
          src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1800&q=90"
          alt="Islamic architecture under a peaceful sky"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#031d18] via-[#062c24]/95 to-[#062c24]/45" />
        <div className="islamic-watermark-bg absolute inset-0 -z-10 opacity-40" />
        <div className="banner-star-pattern absolute inset-0 -z-10 opacity-70" />
        <div className="mx-auto grid max-w-7xl items-end gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.26em] text-[#e3bd68]">
              <Sparkles size={15} />
              Our story
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
              Media made to bring hearts{" "}
              <span className="font-serif italic text-[#e2bd69]">
                closer to remembrance.
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-emerald-50/65">
              SunnahVoice is a thoughtful digital library for Muslims seeking
              beautiful, beneficial content without distraction. We gather
              images, videos and audio that make space for faith in everyday
              life.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-7 backdrop-blur-xl sm:p-9">
            <BookOpen className="text-[#e2bd69]" size={34} />
            <blockquote className="mt-6 font-serif text-2xl leading-relaxed italic text-white">
              “The most beloved deeds are those done consistently, even if they
              are small.”
            </blockquote>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-emerald-100/45">
              A principle behind our work
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="relative">
          <div className="overflow-hidden rounded-[2.5rem] bg-emerald-950">
            <img
              src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1100&q=90"
              alt="Qur'an opened for study"
              className="aspect-[4/5] w-full object-cover opacity-90"
            />
          </div>
          <div className="absolute -bottom-7 -right-4 rounded-3xl bg-[#d6a84b] p-6 text-emerald-950 shadow-xl sm:-right-8">
            <strong className="block text-4xl">Since 2026</strong>
            <span className="text-sm font-semibold">
              Sharing content with purpose
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-[#a67928]">
            Why SunnahVoice exists
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            A calm corner of the internet, built around benefit.
          </h2>
          <div className="mt-7 space-y-5 leading-7 text-slate-600 dark:text-emerald-100/55">
            <p>
              The internet gives us endless content, but meaningful content can
              still be difficult to find. SunnahVoice began with a simple aim:
              make beautiful Islamic media available in one respectful,
              organized place.
            </p>
            <p>
              We design every experience to feel calm and intentional. No
              clutter, no complicated downloads—just media that you can watch,
              hear, save and share with people you care about.
            </p>
          </div>
          <Link
            to="/images"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-6 py-3.5 font-bold text-white dark:bg-[#d6a84b] dark:text-emerald-950"
          >
            Explore our library <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-[#ede5d4] px-6 py-24 dark:bg-[#09231d]">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#a67928]">
              What guides us
            </p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
              Built on clear principles.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.number}
                  className="group rounded-[2rem] border border-emerald-950/10 bg-white/65 p-8 transition duration-500 hover:-translate-y-2 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-13 w-13 place-items-center rounded-2xl bg-emerald-950 text-[#e2bd69] dark:bg-[#d6a84b] dark:text-emerald-950">
                      <Icon size={23} />
                    </span>
                    <span className="font-serif text-4xl italic text-emerald-950/10 dark:text-white/10">
                      {value.number}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold">{value.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600 dark:text-emerald-100/50">
                    {value.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-[#062c24] text-white lg:grid-cols-[1fr_1.15fr]">
          <div className="p-8 sm:p-12">
            <Users className="text-[#d6a84b]" size={34} />
            <h2 className="mt-6 text-4xl font-bold">
              Growing through community.
            </h2>
            <p className="mt-5 leading-7 text-white/55">
              Every download, share and thoughtful suggestion helps beneficial
              media reach a new heart. SunnahVoice is shaped by the community it
              serves.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 font-bold text-[#e2bd69]"
            >
              Join the conversation <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 border-t border-white/10 lg:border-l lg:border-t-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="grid min-h-40 place-content-center border-b border-r border-white/10 p-6 text-center"
              >
                <strong className="text-4xl text-[#e2bd69] sm:text-5xl">
                  {stat.value}
                </strong>
                <span className="mt-2 text-sm text-white/45">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center rounded-[2.5rem] bg-[#d6a84b] px-7 py-14 text-center text-emerald-950">
          <Download size={30} />
          <h2 className="mt-5 max-w-3xl text-4xl font-bold sm:text-5xl">
            Take something beneficial with you.
          </h2>
          <p className="mt-4 max-w-xl text-emerald-950/65">
            Browse, listen, watch and download media created to be shared.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-7 py-3.5 font-bold text-white"
          >
            Start exploring <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

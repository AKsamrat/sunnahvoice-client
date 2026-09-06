import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Headphones,
  Image as ImageIcon,
  Mail,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { mediaItems } from "../../data/media";

const exploreLinks = [
  { label: "Islamic images", to: "/images" },
  { label: "Beneficial videos", to: "/videos" },
  { label: "Recitations & audio", to: "/audio" },
  { label: "Journal & reflections", to: "/blog" },
  { label: "About SunnahVoice", to: "/about" },
];

const supportLinks = [
  { label: "Contact us", to: "/contact" },
  { label: "About", href: "/about" },
  { label: "Suggest media", to: "/contact" },
  { label: "Report an issue", to: "/contact" },
  { label: "Usage guidance", to: "/about" },
];

const mediaIcons = {
  image: ImageIcon,
  video: Play,
  audio: Headphones,
};

const socialLinks = [
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "YouTube", href: "#", icon: FaYoutube },
  { label: "Facebook", href: "#", icon: FaFacebookF },
];

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const latestMedia = mediaItems.slice(-3).reverse();

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
    event.currentTarget.reset();
  };

  return (
    <footer className="relative overflow-hidden bg-[#041f19] text-emerald-50/60">
      <div className="islamic-watermark-bg absolute inset-0 opacity-30" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#d6a84b]/10" />

      <section className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#d6a84b]">
              A gentle reminder in your inbox
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Receive new beneficial media, without the noise.
            </h2>
          </div>

          {subscribed ? (
            <div className="flex min-w-72 items-center gap-3 rounded-full border border-[#d6a84b]/30 bg-[#d6a84b]/10 px-6 py-4 text-[#e7c87e]">
              <Check size={19} />
              <span className="font-semibold">
                You’re on the list. JazakAllahu khayran.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md rounded-full border border-white/15 bg-white/[.06] p-1.5 backdrop-blur"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <Mail className="ml-4 self-center text-white/35" size={18} />
              <input
                id="footer-email"
                name="email"
                required
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d6a84b] text-emerald-950 transition hover:bg-[#e8cb85]"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </section>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-8 lg:grid-cols-[1.2fr_.65fr_.65fr_1.25fr]">
        <div>
          <Link to="/" aria-label="SunnahVoice home">
            <img src="/footer.png" alt="SunnahVoice" className="h-34 w-44  " />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7">
            A calm digital home for Islamic images, beneficial videos, Qur’an
            recitations and reminders you can carry and share.
          </p>
          <div className="mt-7 flex gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-sm transition hover:border-[#d6a84b] hover:bg-[#d6a84b] hover:text-emerald-950"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[.16em] text-white">
            Explore
          </h3>
          <nav className="mt-6 space-y-4">
            {exploreLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block text-sm transition hover:translate-x-1 hover:text-[#e2bd69]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[.16em] text-white">
            Support
          </h3>
          <nav className="mt-6 space-y-4">
            {supportLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block text-sm transition hover:translate-x-1 hover:text-[#e2bd69]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[.16em] text-white">
              Latest media
            </h3>
            <Link to="/" className="text-xs font-bold text-[#d6a84b]">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {latestMedia.map((item) => {
              const Icon = mediaIcons[item.type];
              return (
                <Link
                  key={item.id}
                  to={`/media/${item.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[.07] bg-white/[.035] p-2.5 transition hover:border-[#d6a84b]/35 hover:bg-white/[.07]"
                >
                  <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-emerald-950">
                    <img
                      src={item.cover}
                      alt=""
                      className="h-full w-full object-cover opacity-75 transition group-hover:scale-105"
                    />
                    <span className="absolute inset-0 grid place-items-center text-white">
                      <Icon size={16} />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm text-white">
                      {item.title}
                    </strong>
                    <small className="mt-1 block capitalize text-white/35">
                      {item.type} · {item.meta}
                    </small>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs sm:flex-row">
          <p>© 2026 SunnahVoice. Share beneficial knowledge with care.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 font-bold text-[#d6a84b]"
            >
              Back to top{" "}
              <span className="grid h-8 w-8 place-items-center rounded-full border border-[#d6a84b]/30">
                <ArrowUp size={14} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

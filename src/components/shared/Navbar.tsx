import { useState } from "react";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useScrollY } from "../../hooks";
import { useTheme } from "../../context/ThemeContext";

const links = [
  { label: "Home", href: "/" },
  { label: "Images", href: "/images" },
  { label: "Videos", href: "/videos" },
  { label: "Audio", href: "/audio" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrollY = useScrollY();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#062c24]/95 text-white backdrop-blur-xl transition-all ${scrollY > 25 || open ? "shadow-[0_12px_35px_rgba(3,24,19,.24)]" : ""}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label="SunnahVoice home">
          <img src="/header1.png" alt="SunnahVoice" className="h-16 w-auto" />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`relative py-2 text-sm font-medium transition ${location.pathname === link.href ? "text-[#e5c679]" : "text-emerald-50/70 hover:text-white"}`}
            >
              {link.label}
              {location.pathname === link.href && (
                <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-4 rounded-full bg-[#d6a84b]" />
              )}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <a
            href="/#library"
            aria-label="Search media"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white"
          >
            <Search size={17} />
          </a>
          <Link
            to="/login"
            className="rounded-full bg-[#d6a84b] px-5 py-2.5 text-sm font-bold text-emerald-950"
          >
            Sign in
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 px-6 py-5 md:hidden">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-emerald-50/80"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="mt-3 flex w-full items-center gap-2 border-t border-white/10 pt-5 text-emerald-50/80"
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}Switch
            to {theme === "light" ? "night" : "day"} mode
          </button>
        </div>
      )}
    </nav>
  );
}

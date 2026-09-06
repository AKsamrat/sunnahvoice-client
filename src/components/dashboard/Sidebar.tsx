import { useState } from "react";
import {
  BarChart3,
  BookOpenText,
  Download,
  Home,
  Images,
  Tags,
  LogOut,
  Menu,
  Mail,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Overview", path: "/dashboard", icon: BarChart3, end: true },
  { label: "Media library", path: "/dashboard/media", icon: Images },
  { label: "Categories", path: "/dashboard/categories", icon: Tags },
  { label: "Blog posts", path: "/dashboard/blog", icon: BookOpenText },
  { label: "Downloads", path: "/dashboard/downloads", icon: Download },
  { label: "Subscribers", path: "/dashboard/subscribers", icon: Mail },
  { label: "Users", path: "/dashboard/users", icon: Users },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#05251e] px-5 md:hidden">
        <img
          src="/sunnahvoice-logo.svg"
          alt="SunnahVoice"
          className="h-10 w-auto"
        />
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white"
          aria-label="Open admin menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex w-72 flex-col overflow-hidden bg-[#05251e] text-white transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="islamic-watermark-bg absolute inset-0 opacity-20" />
        <div className="relative flex h-24 items-center justify-between border-b border-white/10 px-6">
          <img
            src="/sunnahvoice-logo.svg"
            alt="SunnahVoice"
            className="h-12 w-auto"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 md:hidden"
            aria-label="Close admin menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="relative px-5 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#d6a84b]">
            Administration
          </p>
          <nav className="mt-4 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-[#d6a84b] text-emerald-950 shadow-lg" : "text-white/55 hover:bg-white/[.07] hover:text-white"}`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="relative mt-auto border-t border-white/10 p-5">
          <a
            href="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/50 transition hover:bg-white/[.07] hover:text-white"
          >
            <Home size={18} />
            View website
          </a>
          <button className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/50 transition hover:bg-red-500/10 hover:text-red-300">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          aria-label="Close admin menu"
        />
      )}
    </>
  );
}

import { Bell, Search } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/media": "Media library",
  "/dashboard/categories": "Category management",
  "/dashboard/blog": "Blog management",
  "/dashboard/downloads": "Download analytics",
  "/dashboard/subscribers": "Subscribers",
  "/dashboard/users": "User management",
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "Administration";

  return (
    <div className="min-h-screen bg-[#f3f1eb] text-emerald-950">
      <Sidebar />
      <div className="pt-16 md:ml-72 md:pt-0">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-emerald-950/10 bg-[#f8f6f0]/90 px-5 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9c7124]">
              SunnahVoice admin
            </p>
            <h1 className="mt-1 text-xl font-bold sm:text-2xl">{title}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <label className="hidden h-10 w-56 items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-4 lg:flex">
              <Search size={15} className="text-slate-400" />
              <input
                placeholder="Search dashboard..."
                className="w-full bg-transparent text-xs outline-none"
              />
            </label>
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-emerald-950/10 bg-white">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#d6a84b]" />
            </button>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-950 text-sm font-bold text-[#e2bd69]">
                SV
              </span>
              <div className="hidden sm:block">
                <strong className="block text-sm">Admin User</strong>
                <span className="text-xs text-slate-400">Super admin</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

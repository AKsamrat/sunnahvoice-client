import VisitorAnalytics from "../../components/dashboard/VisitorAnalytics";
import {
  ArrowRight,
  Download,
  Eye,
  FileAudio,
  FileImage,
  Film,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMedia } from "../../hooks/useMedia";
import { api } from "../../lib/api";


export default function DashboardHome() {
  const { items: mediaItems } = useMedia();
  const [dashboard, setDashboard] = useState({
    users: 0,
    downloads: 0,
    posts: 0,
    media: { total: 0, images: 0, videos: 0, audio: 0 },
  });

  useEffect(() => {
    api.get("/admin/dashboard").then((response) => setDashboard(response.data));
  }, []);

  const recentMedia = mediaItems.slice(0, 5);
  const stats = [
    {
      label: "Total media",
      value: dashboard.media.total.toString(),
      change: "Live library count",
      icon: FileImage,
      color: "bg-[#d7eadf] text-emerald-800",
    },
    {
      label: "Total downloads",
      value: dashboard.downloads.toLocaleString(),
      change: "Completed downloads",
      icon: Download,
      color: "bg-[#f0dfb9] text-[#815d1e]",
    },
    {
      label: "Active users",
      value: dashboard.users.toLocaleString(),
      change: "Registered accounts",
      icon: Users,
      color: "bg-[#dce5f0] text-slate-700",
    },
    {
      label: "Blog posts",
      value: dashboard.posts.toLocaleString(),
      change: "Journal articles",
      icon: Eye,
      color: "bg-[#eadbd4] text-[#815441]",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#07372d] p-7 text-white shadow-xl sm:p-9">
        <div className="banner-star-pattern absolute inset-0 opacity-50" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e2bd69]">
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Assalamu Alaikum, Admin.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
              Your library is growing steadily. Here is what is happening across
              SunnahVoice today.
            </p>
          </div>
          <Link
            to="/dashboard/media"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#d6a84b] px-6 py-3.5 font-bold text-emerald-950"
          >
            <Plus size={18} />
            Add new media
          </Link>
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.color}`}
                >
                  <Icon size={21} />
                </span>
                <TrendingUp size={17} className="text-emerald-600" />
              </div>
              <p className="mt-6 text-sm text-slate-500">{stat.label}</p>
              <strong className="mt-1 block text-3xl">{stat.value}</strong>
              <span className="mt-2 block text-xs font-semibold text-emerald-600">
                {stat.change}
              </span>
            </article>
          );
        })}
      </section>

      <VisitorAnalytics />

      <section className="mt-7">
        <article className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="text-xl font-bold">Library breakdown</h2>
          <p className="mt-1 text-sm text-slate-400">Published media by type</p>
          <div className="mt-8 space-y-6">
            {[
              {
                type: "Images",
                icon: FileImage,
                count: dashboard.media.images,
                percent: 82,
                color: "bg-[#d6a84b]",
              },
              {
                type: "Videos",
                icon: Film,
                count: dashboard.media.videos,
                percent: 68,
                color: "bg-emerald-700",
              },
              {
                type: "Audio",
                icon: FileAudio,
                count: dashboard.media.audio,
                percent: 74,
                color: "bg-[#879e91]",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold">
                      <Icon size={16} /> {item.type}
                    </span>
                    <span className="text-slate-400">{item.count} files</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-emerald-950/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">Recently added</h2>
            <p className="mt-1 text-sm text-slate-400">
              Latest library uploads
            </p>
          </div>
          <Link
            to="/dashboard/media"
            className="flex items-center gap-2 text-sm font-bold text-[#936b24]"
          >
            View library <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-[#f8f6f0] text-[10px] uppercase tracking-[.16em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Media</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Downloads</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/[.07]">
              {recentMedia.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.cover}
                        alt=""
                        className="h-11 w-14 rounded-xl object-cover"
                      />
                      <div>
                        <strong className="block text-sm">{item.title}</strong>
                        <span className="text-xs text-slate-400">
                          {item.publishedAt}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm capitalize">{item.type}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {item.category}
                  </td>
                  <td className="px-5 py-4 text-sm">{item.downloads}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Published
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

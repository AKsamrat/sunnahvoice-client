import { useEffect, useState } from "react";
import { Eye, RefreshCw, Users } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";

type Slice = { name: string; count: number };
type Analytics = {
  unique_visitors: number;
  page_views: number;
  visitors_today: number;
  operating_systems: Slice[];
  browsers: Slice[];
  tracking_since: string | null;
  timezone: string;
};
const colors = ["#075e48", "#d6a84b", "#5685b8", "#a76d91", "#7b9560", "#b86b45", "#648b87", "#7662a1", "#64748b"];

function PieChart({ title, data }: { title: string; data: Slice[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const slices = data.map((item, index) => {
    const from = data.slice(0, index).reduce((sum, slice) => sum + slice.count, 0) / total * 360;
    return { ...item, color: colors[index % colors.length], from, to: from + item.count / total * 360 };
  });
  return <article className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm">
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm text-slate-500">Share of unique visitors in this period</p>
    {!total ? <div className="grid min-h-64 place-items-center text-sm text-slate-500">No visitor data for this period yet.</div> : <div className="mt-6 flex flex-col items-center gap-7 sm:flex-row">
      <div role="img" aria-label={title + ": " + slices.map(item => item.name + " " + (item.count / total * 100).toFixed(1) + "%").join(", ")} className="h-48 w-48 shrink-0 rounded-full border-4 border-white shadow-md" style={{ background: "conic-gradient(" + slices.map(item => item.color + " " + item.from + "deg " + item.to + "deg").join(", ") + ")" }} />
      <ul className="w-full min-w-0 space-y-3">{slices.map(item => <li key={item.name} className="flex items-center justify-between gap-3 text-sm"><span className="flex min-w-0 items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></span><span className="shrink-0 text-right"><strong>{item.count.toLocaleString()}</strong><span className="ml-2 text-xs text-slate-500">{(item.count / total * 100).toFixed(1)}%</span></span></li>)}</ul>
    </div>}
  </article>;
}

export default function VisitorAnalytics() {
  const [days, setDays] = useState("30");
  const [refresh, setRefresh] = useState(0);
  const key = days + ":" + refresh;
  const [state, setState] = useState<{ key: string; data?: Analytics; error?: string }>({ key: "" });
  useEffect(() => {
    let active = true;
    api.get<Analytics>("/admin/visitors", { params: { days } }).then(response => {
      if (active) setState({ key, data: response.data });
    }).catch(error => { if (active) setState({ key, error: apiErrorMessage(error) }); });
    return () => { active = false; };
  }, [days, key]);
  const loading = state.key !== key;
  const data = !loading ? state.data : undefined;
  return <section className="mt-7 text-emerald-950" aria-label="Website visitor analytics">
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><h2 className="text-2xl font-bold">Website visitors</h2><p className="mt-1 text-sm text-slate-500">See your audience and the devices they use.</p></div>
      <div className="flex items-end gap-3"><label className="text-sm font-semibold"><span className="mb-1 block">Period</span><select value={days} onChange={event => setDays(event.target.value)} className="rounded-xl border border-emerald-950/25 bg-white px-4 py-2.5 text-emerald-950 outline-none focus:ring-2 focus:ring-[#b38735]"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="all">All time</option></select></label><button type="button" aria-label="Refresh visitor analytics" disabled={loading} onClick={() => setRefresh(value => value + 1)} className="rounded-xl border border-emerald-950/25 bg-white p-3 disabled:opacity-40"><RefreshCw size={19} /></button></div>
    </div>
    {loading && <p role="status" className="rounded-2xl bg-white p-6 text-slate-500">Loading visitor analytics...</p>}
    {!loading && state.error && <p role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">{state.error} Use refresh to try again.</p>}
    {data && <>
      <div className="mb-5 grid gap-5 sm:grid-cols-3">{[
        { label: "Unique visitors", count: data.unique_visitors, icon: Users, note: "Selected period" },
        { label: "Page views", count: data.page_views, icon: Eye, note: "Selected period" },
        { label: "Visitors today", count: data.visitors_today, icon: Users, note: "Today in " + data.timezone },
      ].map(item => <article key={item.label} className="rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-sm"><item.icon size={22} className="mb-4 text-[#a67928]" /><p className="text-sm text-slate-500">{item.label}</p><strong className="mt-1 block text-3xl">{item.count.toLocaleString()}</strong><p className="mt-2 text-xs text-slate-500">{item.note}</p></article>)}</div>
      <div className="grid gap-5 2xl:grid-cols-2"><PieChart title="Operating systems" data={data.operating_systems} /><PieChart title="Browsers" data={data.browsers} /></div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Unique visitors are anonymous browser profiles, not registered accounts. Clearing browser storage or using another browser counts separately. Browser and OS detection is approximate; some browsers report themselves as Chrome or Safari. Dashboard and sign-in pages are excluded. {data.tracking_since ? "First recorded visit: " + data.tracking_since + " (" + data.timezone + ")." : "Tracking starts with the first public website visit."}</p>
    </>}
  </section>;
}

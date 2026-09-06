import { useEffect, useState } from "react";
import { FileAudio, FileImage, Film, RefreshCw } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import Pagination from "../../components/Pagination";

type DownloadData = {
  total: number;
  by_type: Record<"image" | "video" | "audio", number>;
  daily: { date: string; count: number }[];
  top_media: { id: number; title: string; type: string; count: number }[];
  history: { data: { id: number; title: string; type: string; downloaded_at: string }[]; current_page: number; last_page: number; total: number };
  timezone: string;
};
const sources = [{ label: "Images", type: "image", icon: FileImage }, { label: "Audio", type: "audio", icon: FileAudio }, { label: "Videos", type: "video", icon: Film }] as const;

export default function Orders() {
  const [days, setDays] = useState("30");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const key = [days, type, page, refresh].join(":");
  const [state, setState] = useState<{ key: string; data?: DownloadData; error?: string }>({ key: "" });
  useEffect(() => {
    let active = true;
    api.get<DownloadData>("/admin/downloads", { params: { days, type, page } }).then(response => {
      if (!active) return;
      if (page > response.data.history.last_page) { setPage(response.data.history.last_page); return; }
      setState({ key, data: response.data });
    }).catch(error => { if (active) setState({ key, error: apiErrorMessage(error) }); });
    return () => { active = false; };
  }, [days, type, page, key]);
  const loading = state.key !== key;
  const data = !loading ? state.data : undefined;
  const maximum = Math.max(1, ...(data?.daily.map(day => day.count) ?? []));
  const selectStyle = "rounded-xl border border-emerald-950/25 bg-white px-4 py-2.5 text-sm text-emerald-950 outline-none focus:ring-2 focus:ring-[#b38735]";
  return <div className="mx-auto max-w-[1500px]">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold">Download activity</h2><p className="mt-2 text-sm text-slate-500">Recorded download requests from your website.</p></div><div className="flex flex-wrap items-end gap-3">
      <label><span className="mb-1 block text-sm font-semibold">Period</span><select className={selectStyle} value={days} onChange={event => { setDays(event.target.value); setPage(1); }}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
      <label><span className="mb-1 block text-sm font-semibold">Media type</span><select className={selectStyle} value={type} onChange={event => { setType(event.target.value); setPage(1); }}><option value="all">All media</option><option value="image">Images</option><option value="audio">Audio</option><option value="video">Videos</option></select></label>
      <button type="button" disabled={loading} aria-label="Refresh download activity" onClick={() => setRefresh(value => value + 1)} className="rounded-xl border border-emerald-950/25 bg-white p-3 disabled:opacity-40"><RefreshCw size={19} /></button>
    </div></div>
    {loading && <p role="status" className="rounded-2xl bg-white p-6">Loading downloads...</p>}
    {!loading && state.error && <p role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">{state.error} Use refresh to try again.</p>}
    {data && <>
      <p className="mb-4 text-sm text-slate-500"><strong className="text-emerald-950">{data.total.toLocaleString()}</strong> download requests in the selected period</p>
      <div className="grid gap-5 md:grid-cols-3">{sources.map(source => { const Icon = source.icon; const count = data.by_type[source.type]; const percent = data.total ? count / data.total * 100 : 0; return <article key={source.type} className="rounded-3xl border border-emerald-950/10 bg-white p-6"><Icon size={22} className="text-[#a67928]" /><p className="mt-5 text-sm text-slate-500">{source.label} downloads</p><strong className="mt-1 block text-3xl">{count.toLocaleString()}</strong><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#d6a84b]" style={{ width: percent + "%" }} /></div><p className="mt-2 text-xs text-slate-500">{percent.toFixed(1)}% of selected downloads</p></article>; })}</div>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.2fr_.8fr]">
        <article className="min-w-0 rounded-3xl border border-emerald-950/10 bg-white p-6"><h2 className="text-xl font-bold">Downloads over time</h2><p className="mt-1 text-sm text-slate-500">Daily requests over the last {days} days ({data.timezone})</p>{!data.total ? <p className="py-24 text-center text-sm text-slate-500">No downloads recorded for these filters.</p> : <><div className="mt-8 flex h-60 items-end gap-1" role="img" aria-label={"Daily downloads: " + data.daily.map(day => day.date + ": " + day.count).join(", ")}>{data.daily.map(day => <div key={day.date} className="flex h-full min-w-0 flex-1 items-end" title={day.date + ": " + day.count + " downloads"}><div className="w-full rounded-t-sm bg-emerald-800 transition hover:bg-[#d6a84b]" style={{ height: day.count / maximum * 100 + "%" }} /></div>)}</div><div className="mt-3 flex justify-between text-xs text-slate-500"><span>{data.daily[0]?.date}</span><span>Peak: {maximum}</span><span>{data.daily[data.daily.length - 1]?.date}</span></div></>}</article>
        <article className="rounded-3xl border border-emerald-950/10 bg-white p-6"><h2 className="text-xl font-bold">Most downloaded media</h2><p className="mt-1 text-sm text-slate-500">Top 5 in the selected period</p><ol className="mt-6 divide-y divide-emerald-950/10">{data.top_media.map((item, index) => <li key={item.id} className="flex items-center gap-3 py-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f0eadc] text-xs font-bold">{index + 1}</span><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.title}</strong><span className="text-xs capitalize text-slate-500">{item.type}</span></div><strong>{item.count.toLocaleString()}</strong></li>)}</ol>{!data.top_media.length && <p className="py-12 text-center text-sm text-slate-500">No downloads yet.</p>}</article>
      </div>
      <section className="mt-7 overflow-hidden rounded-3xl border border-emerald-950/10 bg-white"><div className="border-b border-emerald-950/10 p-6"><h2 className="text-xl font-bold">Download history</h2><p className="mt-1 text-sm text-slate-500">Most recent first. Times shown in {data.timezone}.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#f8f6f0] text-slate-500"><tr><th className="px-6 py-4">Media</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Requested at</th></tr></thead><tbody className="divide-y divide-emerald-950/10">{data.history.data.map(item => <tr key={item.id}><td className="px-6 py-4 font-semibold">{item.title}</td><td className="px-6 py-4 capitalize">{item.type}</td><td className="whitespace-nowrap px-6 py-4 text-slate-500">{item.downloaded_at}</td></tr>)}</tbody></table></div>{!data.history.data.length && <p className="p-8 text-center text-sm text-slate-500">No download history for these filters.</p>}<div className="px-6 pb-6"><Pagination page={page} lastPage={data.history.last_page} total={data.history.total} onPageChange={setPage} /></div></section>
      <p className="mt-4 text-xs text-slate-500">Counts reflect download requests, not confirmed file transfers. History includes media moved to trash.</p>
    </>}
  </div>;
}

import { useEffect, useState } from "react";
import { Mail, RefreshCw, Search, Trash2 } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import Pagination from "../../components/Pagination";

type Subscriber = { id: number; email: string; created_at: string };
type Response = { total_subscribers: number; subscribers: { data: Subscriber[]; total: number; last_page: number } };

export default function Subscribers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [removing, setRemoving] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const key = JSON.stringify([search, page, refresh]);
  const [state, setState] = useState<{ key: string; data?: Response; error?: string }>({ key: "" });
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      api.get<Response>("/admin/subscribers", { params: { search: search.trim(), page } }).then(response => {
        if (!active) return;
        if (page > response.data.subscribers.last_page) { setPage(response.data.subscribers.last_page); return; }
        setState({ key, data: response.data });
      }).catch(error => { if (active) setState({ key, error: apiErrorMessage(error) }); });
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [search, page, key]);
  const loading = state.key !== key;
  const data = loading ? undefined : state.data;
  const remove = async (subscriber: Subscriber) => {
    if (!window.confirm("Remove " + subscriber.email + " from the subscriber list?")) return;
    setRemoving(subscriber.id); setMessage(""); setActionError("");
    try {
      await api.delete("/admin/subscribers/" + subscriber.id);
      setMessage("Subscriber removed."); setRefresh(value => value + 1);
    } catch (error) { setActionError(apiErrorMessage(error)); } finally { setRemoving(null); }
  };
  return <div className="mx-auto max-w-[1500px]">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="flex items-center gap-3 text-2xl font-bold"><Mail className="text-[#a67928]" />Gentle Reminder subscribers</h2><p className="mt-2 text-sm text-slate-500">Email signups from the footer's Gentle Reminder form.</p></div><button type="button" aria-label="Refresh subscribers" disabled={loading} onClick={() => setRefresh(value => value + 1)} className="flex w-fit items-center gap-2 rounded-full border border-emerald-950/20 bg-white px-5 py-3 text-sm font-semibold disabled:opacity-50"><RefreshCw size={16} />Refresh</button></div>
    {message && <p role="status" className="mt-5 rounded-2xl bg-emerald-50 p-4 text-emerald-700">{message}</p>}
    {actionError && <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">{actionError}</p>}
    <section className="mt-7 overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm"><div className="flex flex-col justify-between gap-4 border-b border-emerald-950/10 p-5 sm:flex-row sm:items-center"><label className="flex h-12 w-full max-w-md items-center gap-3 rounded-full border border-emerald-950/20 bg-[#f5f3ed] px-4 focus-within:ring-2 focus-within:ring-[#b38735]"><Search size={17} className="shrink-0 text-slate-500" /><span className="sr-only">Search subscribers by email</span><input type="search" maxLength={255} value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Search email addresses..." className="min-w-0 w-full bg-transparent text-sm text-emerald-950 outline-none" /></label><p className="shrink-0 text-sm text-slate-500">Total subscribers: <strong className="text-emerald-950">{data ? data.total_subscribers.toLocaleString() : "--"}</strong></p></div>
      {loading && <p role="status" className="p-10 text-center text-slate-500">Loading subscribers...</p>}
      {!loading && state.error && <p role="alert" className="p-6 text-red-700">{state.error} Use refresh to try again.</p>}
      {data && <><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#f8f6f0] text-slate-500"><tr><th className="px-6 py-4">Email address</th><th className="px-6 py-4">Subscribed on</th><th className="px-6 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-emerald-950/10">{data.subscribers.data.map(subscriber => <tr key={subscriber.id}><td className="break-all px-6 py-4 font-semibold">{subscriber.email}</td><td className="whitespace-nowrap px-6 py-4 text-slate-500">{new Date(subscriber.created_at).toLocaleString()}</td><td className="px-6 py-4 text-right"><button disabled={removing !== null} aria-label={"Remove " + subscriber.email} onClick={() => remove(subscriber)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-40"><Trash2 size={16} />{removing === subscriber.id ? "Removing..." : "Remove"}</button></td></tr>)}</tbody></table></div>{!data.subscribers.data.length && <p className="p-10 text-center text-slate-500">{search ? "No subscribers match your search." : "No subscribers yet. Signups from the footer will appear here."}</p>}<div className="px-5 pb-5"><Pagination page={page} lastPage={data.subscribers.last_page} total={data.subscribers.total} onPageChange={setPage} /></div></>}
    </section>
  </div>;
}

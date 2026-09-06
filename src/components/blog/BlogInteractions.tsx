import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";
import Pagination from "../Pagination";

type Comment = { id: number; body: string; author: string; created_at: string; can_delete: boolean };
type Interactions = { comments: { data: Comment[]; total: number; last_page: number }; likes_count: number; liked: boolean; can_interact: boolean };
const button = "rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38735] disabled:opacity-50";

export default function BlogInteractions({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{ key: string; data?: Interactions; error?: string }>();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const key = slug + ":" + page + ":" + revision;
  const data = result?.key === key ? result.data : undefined;
  const loadError = result?.key === key ? result.error : undefined;
  const loginState = { from: "/blog/" + slug };

  useEffect(() => {
    const controller = new AbortController();
    api.get<Interactions>("/posts/" + slug + "/interactions", { params: { page }, signal: controller.signal })
      .then(({ data: response }) => {
        if (controller.signal.aborted) return;
        if (page > response.comments.last_page) { setPage(response.comments.last_page); return; }
        setResult({ key, data: response });
      })
      .catch((cause: unknown) => { if (!controller.signal.aborted) setResult({ key, error: apiErrorMessage(cause) }); });
    return () => controller.abort();
  }, [slug, page, key]);

  async function mutate(action: () => Promise<unknown>, success: string, reset = false) {
    setBusy(true); setError(""); setMessage("");
    try {
      await action();
      if (reset) { setBody(""); setPage(1); }
      setMessage(success); setRevision(value => value + 1);
    } catch (cause) { setError(apiErrorMessage(cause)); }
    finally { setBusy(false); }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim() || busy) return;
    void mutate(() => api.post("/posts/" + slug + "/comments", { body: body.trim() }), "Your comment was posted.", true);
  }

  return (
    <section aria-label="Article discussion" className="mx-auto mt-8 max-w-5xl px-6">
      <div className="rounded-3xl border border-emerald-950/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/10 pb-6 dark:border-white/10">
          <h2 className="flex items-center gap-3 text-2xl font-bold"><MessageCircle size={24} /> Comments {data && <span className="text-base font-normal opacity-60">({data.comments.total})</span>}</h2>
          <button type="button" disabled={busy || !data} aria-pressed={data?.liked ?? false}
            onClick={() => { if (!data?.can_interact) { navigate("/login", { state: loginState }); return; } void mutate(() => api.put("/posts/" + slug + "/like", { liked: !data.liked }), data.liked ? "Like removed." : "Article liked."); }}
            className={button + (data?.liked ? " bg-[#d6a84b] text-emerald-950" : " border border-emerald-950/15 hover:bg-emerald-950/5 dark:border-white/20 dark:hover:bg-white/10")}>
            <span className="flex items-center gap-2"><Heart size={18} fill={data?.liked ? "currentColor" : "none"} />{data?.liked ? "Liked" : "Like"}{data ? " ? " + data.likes_count : ""}</span>
          </button>
        </div>
        <p role="status" className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>
        {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-300">{error}</p>}
        {loadError ? <div role="alert" className="py-6"><p>{loadError}</p><button className={button + " mt-3 bg-[#d6a84b] text-emerald-950"} onClick={() => setRevision(value => value + 1)}>Try again</button></div> : !data ? <p role="status" className="py-8 opacity-60">Loading discussion...</p> : <>
          {data.can_interact ? <form onSubmit={submit} className="mt-5">
            <label htmlFor="blog-comment" className="mb-3 block font-semibold">Join the conversation</label>
            <textarea id="blog-comment" value={body} onChange={event => setBody(event.target.value)} required maxLength={2000} rows={4} disabled={busy}
              placeholder="Share your thoughts respectfully..." className="w-full resize-y rounded-2xl border border-emerald-950/20 bg-[#fbf8f1] p-4 text-emerald-950 placeholder:text-slate-500 focus:border-[#b38735] focus:outline-none focus:ring-2 focus:ring-[#b38735]/25 dark:border-white/20 dark:bg-[#061914] dark:text-emerald-50 dark:placeholder:text-emerald-100/40" />
            <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs opacity-60">{body.length}/2,000 characters</span><button disabled={busy || !body.trim()} className={button + " bg-emerald-900 text-white hover:bg-emerald-800 dark:bg-[#d6a84b] dark:text-emerald-950"}>{busy ? "Saving..." : "Post comment"}</button></div>
          </form> : <p className="my-6 rounded-2xl bg-emerald-950/5 p-5 dark:bg-white/5"><Link to="/login" state={loginState} className="font-bold text-[#9c7124] underline dark:text-[#e2bd69]">Sign in</Link> to leave a comment or like this article.</p>}
          <div className="mt-8 space-y-5">
            {data.comments.data.length === 0 && <p className="py-6 text-center opacity-60">No comments yet. Be the first to share a reflection.</p>}
            {data.comments.data.map(comment => <article key={comment.id} className="rounded-2xl border border-emerald-950/10 p-5 dark:border-white/10">
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{comment.author}</h3><time className="text-xs opacity-60" dateTime={comment.created_at.replace(" ", "T") + "Z"}>{new Date(comment.created_at.replace(" ", "T") + "Z").toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time></div>
                {comment.can_delete && <button type="button" disabled={busy} aria-label={"Delete comment by " + comment.author} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 dark:text-emerald-100/60 dark:hover:bg-red-950/40" onClick={() => { if (window.confirm("Delete this comment?")) void mutate(() => api.delete("/posts/" + slug + "/comments/" + comment.id), "Comment removed."); }}><Trash2 size={16} /></button>}
              </div><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 dark:text-emerald-50/75">{comment.body}</p>
            </article>)}
          </div>
          {data.comments.last_page > 1 && <Pagination page={page} lastPage={data.comments.last_page} total={data.comments.total} onPageChange={next => { if (!busy) setPage(next); }} />}
        </>}
      </div>
    </section>
  );
}

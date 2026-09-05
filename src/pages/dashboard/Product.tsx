import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Download,
  Edit3,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { MediaItem, MediaType } from "../../data/media";
import {
  apiErrorMessage,
  createMedia,
  deleteMedia,
  fetchAdminMedia,
  fetchCategories,
  type Category,
  updateMedia,
} from "../../lib/api";

type EditorProps = {
  item: MediaItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (item: MediaItem) => void;
};

function MediaEditor({ item, categories, onClose, onSaved }: EditorProps) {
  const [type, setType] = useState<MediaType>(item?.type ?? "image");
  const [categoryId, setCategoryId] = useState(item?.categoryId ? String(item.categoryId) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const saved = item
        ? await updateMedia(item, form)
        : await createMedia(form);
      onSaved(saved);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#02130f]/80 p-4 backdrop-blur-sm">
      <div className="admin-media-editor max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white text-emerald-950 shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-950/10 bg-white px-7 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a67928]">
              Media manager
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {item ? "Edit media" : "Upload new media"}
            </h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
            <X size={18} />
          </button>
        </header>

        <form onSubmit={submit} className="space-y-6 p-7">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Media title</span>
              <input name="title" required defaultValue={item?.title} className="contact-input" placeholder="Enter a clear title" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Media type</span>
              <select name="type" value={type} onChange={(event) => { setType(event.target.value as MediaType); setCategoryId(""); }} className="contact-input">
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Category</span>
              <select required name="category_id" value={categoryId} onChange={event => setCategoryId(event.target.value)} className="contact-input">
                <option value="">Select a category</option>
                {categories.filter((category) => category.type === type).map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <Link to="/dashboard/categories" className="mt-2 block text-sm text-[#9c7124]">Manage categories</Link>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Subtitle</span>
              <input name="subtitle" defaultValue={item?.subtitle} className="contact-input" placeholder="Short supporting text" />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Description</span>
              <textarea name="description" defaultValue={item?.description} rows={4} className="contact-input resize-none" />
            </label>
            {type !== "image" && (
              <label>
                <span className="mb-2 block text-sm font-bold">Duration in seconds</span>
                <input name="duration" type="number" min="0" defaultValue={item ? undefined : 0} className="contact-input" />
              </label>
            )}
            <label>
              <span className="mb-2 block text-sm font-bold">Status</span>
              <select name="status" defaultValue={item?.status ?? "published"} className="contact-input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </label>
            <label className="rounded-2xl border border-dashed border-emerald-950/20 bg-[#faf8f2] p-5">
              <span className="flex items-center gap-2 text-sm font-bold"><UploadCloud size={17} /> Cover image</span>
              <input name="cover" type="file" accept="image/*" className="admin-file-input mt-4 block w-full text-xs" />
              <small className="mt-2 block text-slate-400">Optional, maximum 5 MB</small>
            </label>
            <label className="rounded-2xl border border-dashed border-emerald-950/20 bg-[#faf8f2] p-5">
              <span className="flex items-center gap-2 text-sm font-bold"><UploadCloud size={17} /> {type} file</span>
              <input name="file" required={!item} type="file" accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "audio/*"} className="admin-file-input mt-4 block w-full text-xs" />
              <small className="mt-2 block text-slate-400">{item ? "Leave empty to keep current file" : "Required, maximum 100 MB"}</small>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-emerald-950/10 pt-6">
            <button type="button" onClick={onClose} className="rounded-full border border-emerald-950/15 px-6 py-3 font-bold">Cancel</button>
            <button disabled={loading} className="rounded-full bg-[#d6a84b] px-7 py-3 font-bold text-emerald-950 disabled:opacity-50">
              {loading ? "Saving..." : item ? "Save changes" : "Upload media"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Product() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<MediaItem | null | "new">(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const loadMedia = () =>
    fetchAdminMedia()
      .then(setMediaItems)
      .catch((error) => setMessage(apiErrorMessage(error)));

  useEffect(() => {
    loadMedia();
    fetchCategories().then(setCategories).catch((error) => setMessage(apiErrorMessage(error)));
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const items = useMemo(
    () => mediaItems.filter((item) =>
      (type === "all" || item.type === type) &&
      item.title.toLowerCase().includes(query.toLowerCase())),
    [mediaItems, type, query],
  );

  const toggleStatus = async (item: MediaItem) => {
    const form = new FormData();
    form.set("title", item.title);
    form.set("type", item.type);
    form.set("status", item.status === "published" ? "draft" : "published");
    if (item.subtitle) form.set("subtitle", item.subtitle);
    if (item.description) form.set("description", item.description);
    if (item.categoryId) form.set("category_id", String(item.categoryId));
    try {
      const updated = await updateMedia(item, form);
      setMediaItems((current) => current.map((entry) => entry.id === updated.id ? updated : entry));
      setMenuId(null);
    } catch (error) {
      setMessage(apiErrorMessage(error));
    }
  };

  const remove = async (item: MediaItem) => {
    if (!window.confirm(`Delete “${item.title}”? This moves it to trash.`)) return;
    try {
      await deleteMedia(item);
      setMediaItems((current) => current.filter((entry) => entry.id !== item.id));
      setMenuId(null);
    } catch (error) {
      setMessage(apiErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">Create, review and organize all downloadable content.</p>
          <div className="mt-4 flex gap-2">
            {["all", "image", "video", "audio"].map((filter) => (
              <button key={filter} onClick={() => setType(filter)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${type === filter ? "bg-emerald-950 text-white" : "border border-emerald-950/10 bg-white text-slate-500"}`}>{filter}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setEditor("new")} className="flex w-fit items-center gap-2 rounded-full bg-[#d6a84b] px-6 py-3 font-bold text-emerald-950">
          <Plus size={18} /> Upload media
        </button>
      </div>

      {message && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</div>}

      <section className="mt-7 overflow-visible rounded-[1.75rem] border border-emerald-950/10 bg-white shadow-sm">
        <div className="border-b border-emerald-950/10 p-5">
          <label className="flex h-11 max-w-md items-center gap-3 rounded-full bg-[#f5f3ed] px-4">
            <Search size={16} className="text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search media..." className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#f8f6f0] text-[10px] uppercase tracking-[.16em] text-slate-400">
              <tr><th className="px-6 py-4">Title</th><th className="px-5 py-4">Type</th><th className="px-5 py-4">Published</th><th className="px-5 py-4">Performance</th><th className="px-5 py-4">Status</th><th className="px-5 py-4" /></tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/[.07]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#faf8f3]">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={item.cover} alt="" className="h-12 w-16 rounded-xl object-cover" /><div><strong className="block text-sm">{item.title}</strong><span className="text-xs text-slate-400">{item.category} · {item.meta}</span></div></div></td>
                  <td className="px-5 py-4"><span className="rounded-full bg-[#eee7d8] px-3 py-1 text-xs font-bold capitalize">{item.type}</span></td>
                  <td className="px-5 py-4 text-xs text-slate-500">{item.publishedAt || "Not published"}</td>
                  <td className="px-5 py-4"><div className="flex gap-4 text-xs"><span className="flex items-center gap-1"><Eye size={14} />{item.views ?? 0}</span><span className="flex items-center gap-1"><Download size={14} />{item.downloads}</span></div></td>
                  <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${item.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>{item.status}</span></td>
                  <td className="relative px-5 py-4">
                    <button onClick={() => setMenuId(menuId === item.id ? null : item.id)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><MoreHorizontal size={18} /></button>
                    {menuId === item.id && (
                      <div ref={menuRef} className="absolute right-10 top-12 z-30 w-48 overflow-hidden rounded-2xl border border-emerald-950/10 bg-white p-2 shadow-xl">
                        <Link to={`/media/${item.slug ?? item.id}`} target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"><Eye size={16} /> View media</Link>
                        <button onClick={() => { setEditor(item); setMenuId(null); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"><Edit3 size={16} /> Edit details</button>
                        <button onClick={() => toggleStatus(item)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50">{item.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />} {item.status === "published" ? "Move to draft" : "Publish"}</button>
                        <button onClick={() => remove(item)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"><Trash2 size={16} /> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <p className="p-10 text-center text-sm text-slate-400">No media found.</p>}
        </div>
      </section>

      {editor && (
        <MediaEditor
          item={editor === "new" ? null : editor}
          categories={categories}
          onClose={() => setEditor(null)}
          onSaved={(saved) => {
            setMediaItems((current) => {
              const exists = current.some((item) => item.id === saved.id);
              return exists ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current];
            });
            setEditor(null);
          }}
        />
      )}
    </div>
  );
}

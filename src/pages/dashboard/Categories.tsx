import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { apiErrorMessage, deleteCategory, fetchAdminCategories, saveCategory, type Category, type CategoryType } from "../../lib/api";

const types: CategoryType[] = ["audio", "video", "image", "blog"];
export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<CategoryType | "all">("all");
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("audio");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetchAdminCategories().then(setCategories).catch(error => setError(apiErrorMessage(error))).finally(() => setLoading(false));
  }, []);
  const reset = () => { setEditing(null); setName(""); setDescription(""); setActive(true); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      const saved = await saveCategory({ name: name.trim(), type, description, is_active: active }, editing?.id);
      setCategories(current => [...current.filter(item => item.id !== saved.id), saved].sort((a, b) => a.name.localeCompare(b.name)));
      setMessage(editing ? "Category updated." : "Category created. You can now select it when uploading content."); reset();
    } catch (error) { setError(apiErrorMessage(error)); } finally { setSaving(false); }
  };
  const remove = async (category: Category) => {
    if (!window.confirm('Delete category "' + category.name + '"?')) return;
    setSaving(true); setError(""); setMessage("");
    try { await deleteCategory(category.id); setCategories(current => current.filter(item => item.id !== category.id)); if (editing?.id === category.id) reset(); setMessage("Category deleted."); }
    catch (error) { setError(apiErrorMessage(error)); } finally { setSaving(false); }
  };
  return <div className="mx-auto max-w-[1500px] text-emerald-950">
    <p className="text-sm text-slate-500">Create categories for audio, videos, images and blog posts. Every upload belongs to a category of the same type.</p>
    {error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {message && <p role="status" className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>}
    <div className="mt-7 grid items-start gap-7 xl:grid-cols-[350px_1fr]">
      <form onSubmit={submit} className="admin-media-editor space-y-5 rounded-3xl border border-emerald-950/10 bg-white p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Plus size={20} />{editing ? "Edit category" : "New category"}</h2>
        <label className="block"><span className="mb-2 block text-sm font-bold">Name</span><input required maxLength={120} value={name} onChange={event => setName(event.target.value)} className="contact-input" placeholder="e.g. Quran recitation" /></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Content type</span><select value={type} onChange={event => setType(event.target.value as CategoryType)} className="contact-input">{types.map(item => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Description</span><textarea value={description} onChange={event => setDescription(event.target.value)} rows={3} className="contact-input resize-y" placeholder="Describe this category (optional)" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-emerald-900" checked={active} onChange={event => setActive(event.target.checked)} />Active</label>
        <div className="flex gap-3"><button disabled={saving || !name.trim()} className="rounded-full bg-[#d6a84b] px-5 py-3 text-sm font-bold disabled:opacity-50">{saving ? "Saving..." : editing ? "Save changes" : "Create category"}</button>{editing && <button type="button" onClick={reset} className="text-sm font-bold">Cancel</button>}</div>
      </form>
      <section className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-emerald-950/10 p-5">{(["all", ...types] as const).map(item => <button key={item} onClick={() => setFilter(item)} className={"rounded-full px-4 py-2 text-sm font-bold capitalize " + (filter === item ? "bg-emerald-950 text-white" : "bg-slate-100")}>{item}</button>)}</div>
        {loading ? <p role="status" className="p-8">Loading categories...</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[#f8f6f0] text-slate-500"><tr><th className="p-4">Category</th><th className="p-4">Type</th><th className="p-4">Content</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{categories.filter(item => filter === "all" || item.type === filter).map(category => <tr key={category.id} className="border-t border-emerald-950/10"><td className="p-4"><strong>{category.name}</strong><p className="mt-1 text-xs text-slate-500">{category.description}</p></td><td className="p-4 capitalize">{category.type ?? "Shared"}</td><td className="p-4">{(category.media_count ?? 0) + (category.posts_count ?? 0)}</td><td className="p-4">{category.is_active ? "Active" : "Inactive"}</td><td className="p-4"><div className="flex gap-3"><button disabled={saving} aria-label={"Edit " + category.name} onClick={() => { setEditing(category); setName(category.name); setType(category.type ?? "audio"); setDescription(category.description ?? ""); setActive(category.is_active); }}><Pencil size={17} /></button><button disabled={saving || !!((category.media_count ?? 0) + (category.posts_count ?? 0))} title="Only empty categories can be deleted" aria-label={"Delete " + category.name} onClick={() => remove(category)} className="text-red-600 disabled:opacity-30"><Trash2 size={17} /></button></div></td></tr>)}</tbody></table>{!categories.some(item => filter === "all" || item.type === filter) && <p className="p-8 text-center text-slate-500">No categories yet. Create one to start organizing content.</p>}</div>}
      </section>
    </div>
  </div>;
}

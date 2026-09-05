import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Edit3,
  Eye,
  EyeOff,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  apiErrorMessage,
  createPost,
  deletePost,
  fetchAdminPosts,
  fetchCategories,
  type Category,
  updatePost,
  type AdminBlogPost,
} from "../../lib/api";

type EditorProps = {
  post: AdminBlogPost | null;
  onClose: () => void;
  onSaved: (post: AdminBlogPost) => void;
};

function BlogEditor({ post, onClose, onSaved }: EditorProps) {
  const [categoryId, setCategoryId] = useState(post?.categoryId ? String(post.categoryId) : "");
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetchCategories("blog").then(setCategories).catch(error => setError(apiErrorMessage(error)));
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new FormData(event.currentTarget);
      const saved = post ? await updatePost(post, form) : await createPost(form);
      onSaved(saved);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#02130f]/80 p-4 backdrop-blur-sm">
      <div className="admin-media-editor max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white text-emerald-950 shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-950/10 bg-white px-7 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a67928]">
              Journal editor
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {post ? "Edit blog post" : "Create a blog post"}
            </h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
            <X size={18} />
          </button>
        </header>

        <form onSubmit={submit} className="space-y-6 p-7">
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Post title</span>
              <input required name="title" defaultValue={post?.title} className="contact-input" placeholder="Enter the article title" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Category</span>
              <select required name="category_id" value={categoryId} onChange={event => setCategoryId(event.target.value)} className="contact-input">
                <option value="">Select a category</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <Link to="/dashboard/categories" className="mt-2 block text-sm text-[#9c7124]">Manage categories</Link>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Status</span>
              <select name="status" defaultValue={post?.status ?? "draft"} className="contact-input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Short excerpt</span>
              <textarea name="excerpt" defaultValue={post?.excerpt} rows={3} className="contact-input resize-none" placeholder="A short introduction shown on the blog page" />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Article content</span>
              <textarea required name="content" defaultValue={post?.content} rows={12} className="contact-input resize-y" placeholder="Write the complete article. Separate paragraphs with an empty line." />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Featured article</span>
              <select name="is_featured" defaultValue={post?.featured ? "1" : "0"} className="contact-input">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </label>
            <label className="rounded-2xl border border-dashed border-emerald-950/20 bg-[#faf8f2] p-5">
              <span className="flex items-center gap-2 text-sm font-bold"><UploadCloud size={17} /> Cover image</span>
              <input name="cover" type="file" accept="image/*" className="admin-file-input mt-4 block w-full text-xs" />
              <small className="mt-2 block text-slate-400">{post ? "Leave empty to keep current cover" : "Optional, maximum 5 MB"}</small>
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-emerald-950/10 pt-6">
            <button type="button" onClick={onClose} className="rounded-full border border-emerald-950/15 px-6 py-3 font-bold">Cancel</button>
            <button disabled={loading} className="rounded-full bg-[#d6a84b] px-7 py-3 font-bold text-emerald-950 disabled:opacity-50">
              {loading ? "Saving..." : post ? "Save changes" : "Create post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editor, setEditor] = useState<AdminBlogPost | null | "new">(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAdminPosts().then(setPosts).catch((error) => setMessage(apiErrorMessage(error)));
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = useMemo(
    () => posts.filter((post) =>
      (status === "all" || post.status === status) &&
      `${post.title} ${post.category}`.toLowerCase().includes(query.toLowerCase())),
    [posts, query, status],
  );

  const quickUpdate = async (post: AdminBlogPost, changes: { status?: "draft" | "published"; featured?: boolean }) => {
    const form = new FormData();
    form.set("title", post.title);
    form.set("content", post.content);
    form.set("status", changes.status ?? post.status);
    form.set("is_featured", String(Number(changes.featured ?? post.featured)));
    if (post.excerpt) form.set("excerpt", post.excerpt);
    if (post.categoryId) form.set("category_id", String(post.categoryId));
    try {
      const saved = await updatePost(post, form);
      setPosts((current) => current.map((item) => item.id === saved.id ? saved : item));
      setMenuId(null);
    } catch (error) {
      setMessage(apiErrorMessage(error));
    }
  };

  const remove = async (post: AdminBlogPost) => {
    if (!window.confirm(`Delete “${post.title}”? This moves it to trash.`)) return;
    try {
      await deletePost(post);
      setPosts((current) => current.filter((item) => item.id !== post.id));
      setMenuId(null);
    } catch (error) {
      setMessage(apiErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">Write, publish and organize SunnahVoice journal articles.</p>
          <div className="mt-4 flex gap-2">
            {["all", "published", "draft"].map((filter) => (
              <button key={filter} onClick={() => setStatus(filter)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${status === filter ? "bg-emerald-950 text-white" : "border border-emerald-950/10 bg-white text-slate-500"}`}>{filter}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setEditor("new")} className="flex items-center gap-2 rounded-full bg-[#d6a84b] px-6 py-3 font-bold text-emerald-950"><Plus size={18} /> New blog post</button>
      </div>
      {message && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</div>}

      <section className="mt-7 overflow-visible rounded-[1.75rem] border border-emerald-950/10 bg-white shadow-sm">
        <div className="border-b border-emerald-950/10 p-5">
          <label className="flex h-11 max-w-md items-center gap-3 rounded-full bg-[#f5f3ed] px-4">
            <Search size={16} className="text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts..." className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#f8f6f0] text-[10px] uppercase tracking-[.16em] text-slate-400">
              <tr><th className="px-6 py-4">Article</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Published</th><th className="px-5 py-4">Views</th><th className="px-5 py-4">Status</th><th className="px-5 py-4" /></tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/[.07]">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-[#faf8f3]">
                  <td className="px-6 py-4"><div className="flex items-center gap-3">{post.image ? <img src={post.image} alt="" className="h-12 w-16 rounded-xl object-cover" /> : <span className="grid h-12 w-16 place-items-center rounded-xl bg-emerald-950 text-[#d6a84b]"><FileText size={20} /></span>}<div><strong className="block max-w-md truncate text-sm">{post.title}</strong><span className="flex items-center gap-1 text-xs text-slate-400">{post.featured && <Star size={12} fill="currentColor" className="text-[#b38735]" />}{post.readTime}</span></div></div></td>
                  <td className="px-5 py-4 text-sm">{post.category}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">{post.publishedAt || "Not published"}</td>
                  <td className="px-5 py-4 text-sm">{post.views}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{post.status}</span></td>
                  <td className="relative px-5 py-4">
                    <button onClick={() => setMenuId(menuId === post.id ? null : post.id)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"><MoreHorizontal size={18} /></button>
                    {menuId === post.id && <div ref={menuRef} className="absolute right-10 top-12 z-30 w-52 rounded-2xl border border-emerald-950/10 bg-white p-2 shadow-xl">
                      {post.status === "published" && <Link to={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"><Eye size={16} /> Preview article</Link>}
                      <button onClick={() => { setEditor(post); setMenuId(null); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"><Edit3 size={16} /> Edit article</button>
                      <button onClick={() => quickUpdate(post, { status: post.status === "published" ? "draft" : "published" })} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50">{post.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}{post.status === "published" ? "Move to draft" : "Publish"}</button>
                      <button onClick={() => quickUpdate(post, { featured: !post.featured })} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-50"><Star size={16} />{post.featured ? "Remove featured" : "Mark featured"}</button>
                      <button onClick={() => remove(post)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"><Trash2 size={16} /> Delete</button>
                    </div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <p className="p-10 text-center text-sm text-slate-400">No blog posts found.</p>}
        </div>
      </section>

      {editor && <BlogEditor post={editor === "new" ? null : editor} onClose={() => setEditor(null)} onSaved={(saved) => {
        setPosts((current) => current.some((post) => post.id === saved.id) ? current.map((post) => post.id === saved.id ? saved : post) : [saved, ...current]);
        setEditor(null);
      }} />}
    </div>
  );
}

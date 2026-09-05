import axios from "axios";
import type { BlogPost } from "../data/blog";
import type { MediaItem, MediaType } from "../data/media";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

const STORAGE_URL = API_URL.replace(/\/api\/v1\/?$/, "/storage");
const TOKEN_KEY = "sunnahvoice_token";

export const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function saveAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function apiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors;
    const firstError = errors && Object.values(errors).flat()[0];
    return String(firstError ?? error.response?.data?.message ?? "Request failed.");
  }
  return "Something went wrong. Please try again.";
}

type ApiCategory = { id: number; name: string; slug: string };

export type ApiMedia = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  type: MediaType;
  category: ApiCategory | null;
  cover_path: string | null;
  file_path: string;
  duration: number | null;
  downloads: number;
  views: number;
  status: "draft" | "published";
  published_at: string | null;
};

type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
};

function assetUrl(path: string | null) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${STORAGE_URL}/${path.replace(/^\//, "")}`;
}

function durationLabel(seconds: number | null, type: MediaType) {
  if (!seconds) return type === "image" ? "HD image" : "Media";
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder} min`;
}

export function normalizeMedia(item: ApiMedia): MediaItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    subtitle: item.subtitle ?? "",
    description: item.description ?? "",
    type: item.type,
    category: item.category?.name ?? "Uncategorized",
    categoryId: item.category?.id,
    cover: assetUrl(item.cover_path) || assetUrl(item.file_path),
    fileUrl: assetUrl(item.file_path),
    meta: durationLabel(item.duration, item.type),
    publishedAt: item.published_at
      ? new Date(item.published_at).toLocaleDateString()
      : "",
    downloads: new Intl.NumberFormat("en", { notation: "compact" }).format(
      item.downloads,
    ),
    status: item.status,
    views: item.views,
  };
}

export async function fetchMedia(type?: MediaType, perPage = 50) {
  const response = await api.get<Paginated<ApiMedia>>("/media", {
    params: { type, per_page: perPage },
  });
  return response.data.data.map(normalizeMedia);
}

export async function fetchMediaItem(slug: string) {
  const response = await api.get<ApiMedia>(`/media/${slug}`);
  return normalizeMedia(response.data);
}

export async function requestDownload(item: MediaItem) {
  const response = await api.post<{ download_url: string }>(
    `/media/${item.slug ?? item.id}/download`,
  );
  return response.data.download_url;
}

export type CategoryType = MediaType | "blog";
export type Category = ApiCategory & { type: CategoryType | null; description?: string | null; is_active: boolean; media_count?: number; posts_count?: number };

export async function fetchCategories(type?: CategoryType) {
  const response = await api.get<Category[]>("/categories", { params: { type } });
  return response.data;
}

export async function fetchAdminMedia() {
  const response = await api.get<Paginated<ApiMedia>>("/admin/media", {
    params: { per_page: 100 },
  });
  return response.data.data.map(normalizeMedia);
}

export async function createMedia(form: FormData) {
  const response = await api.post<ApiMedia>("/admin/media", form);
  return normalizeMedia(response.data);
}

export async function updateMedia(item: MediaItem, form: FormData) {
  form.set("_method", "PATCH");
  const response = await api.post<ApiMedia>(
    `/admin/media/${item.slug ?? item.id}`,
    form,
  );
  return normalizeMedia(response.data);
}

export async function deleteMedia(item: MediaItem) {
  await api.delete(`/admin/media/${item.slug ?? item.id}`);
}

export type ApiPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_path: string | null;
  category: string | null;
  category_id: number | null;
  topic?: ApiCategory | null;
  is_featured: boolean;
  status: "draft" | "published";
  views: number;
  published_at: string | null;
  author: { name: string } | null;
};

export type AdminBlogPost = BlogPost & {
  categoryId?: number;
  content: string;
  status: "draft" | "published";
  views: number;
};

function normalizePost(post: ApiPost): AdminBlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.topic?.name ?? post.category ?? "Reflection",
    categoryId: post.category_id ?? undefined,
    image: assetUrl(post.cover_path),
    author: post.author?.name ?? "SunnahVoice Editorial",
    authorRole: "Contributor",
    publishedAt: post.published_at
      ? new Date(post.published_at).toLocaleDateString()
      : "",
    readTime: `${Math.max(1, Math.ceil(post.content.split(/\s+/).length / 220))} min read`,
    featured: post.is_featured,
    sections: [{ paragraphs: post.content.split(/\n\n+/).filter(Boolean) }],
    content: post.content,
    status: post.status,
    views: post.views,
  };
}

export async function fetchPosts(perPage = 50) {
  const response = await api.get<Paginated<ApiPost>>("/posts", {
    params: { per_page: perPage },
  });
  return response.data.data.map(normalizePost);
}

export async function fetchPost(slug: string) {
  const response = await api.get<ApiPost>(`/posts/${slug}`);
  return normalizePost(response.data);
}

export async function fetchAdminPosts() {
  const response = await api.get<Paginated<ApiPost>>("/admin/posts", {
    params: { per_page: 100 },
  });
  return response.data.data.map(normalizePost);
}

export async function createPost(form: FormData) {
  const response = await api.post<ApiPost>("/admin/posts", form);
  return normalizePost(response.data);
}

export async function updatePost(post: AdminBlogPost, form: FormData) {
  form.set("_method", "PATCH");
  const response = await api.post<ApiPost>(`/admin/posts/${post.slug}`, form);
  return normalizePost(response.data);
}

export async function deletePost(post: AdminBlogPost) {
  await api.delete(`/admin/posts/${post.slug}`);
}

export async function fetchMediaPage(type: MediaType, page: number, category = "All", search = "") {
  const { data } = await api.get<Paginated<ApiMedia>>("/media", { params: { type, page, per_page: 9, category: category === "All" ? undefined : category, search: search.trim() } });
  return { ...data, data: data.data.map(normalizeMedia) };
}

export async function fetchPostsPage(page: number, category: string, search: string) {
  const { data } = await api.get<Paginated<ApiPost>>("/posts", {
    params: { page, per_page: 6, category: category === "All" ? undefined : category, search: search.trim() },
  });
  return { ...data, data: data.data.map(normalizePost) };
}

export async function fetchAdminCategories() {
  const { data } = await api.get<Category[]>("/admin/categories");
  return data;
}
export async function saveCategory(category: { name: string; type: CategoryType; description: string; is_active: boolean }, id?: number) {
  const response = id ? await api.patch<Category>("/admin/categories/" + id, category) : await api.post<Category>("/admin/categories", category);
  return response.data;
}
export async function deleteCategory(id: number) {
  await api.delete("/admin/categories/" + id);
}

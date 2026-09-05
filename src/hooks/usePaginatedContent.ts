import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MediaType } from "../data/media";
import { apiErrorMessage, fetchMediaPage, fetchPostsPage } from "../lib/api";

type ContentType = MediaType | "blog";
type PageResult<T extends ContentType> = Awaited<ReturnType<T extends "blog" ? typeof fetchPostsPage : typeof fetchMediaPage>>;

export function usePaginatedContent<T extends ContentType>(type: T) {
  const [params, setParams] = useSearchParams();
  const requestedPage = Number(params.get("page") ?? 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const category = params.get("category") ?? "All";
  const query = params.get("search") ?? "";
  const key = JSON.stringify([type, page, category, query]);
  const [state, setState] = useState<{ key: string; result?: PageResult<T>; error?: string }>({ key: "" });
  useEffect(() => {
    let active = true;
    const request = type === "blog" ? fetchPostsPage(page, category, query) : fetchMediaPage(type, page, category, query);
    request.then(result => {
      if (!active) return;
      if (page > result.last_page) {
        setParams(previous => {
          const next = new URLSearchParams(previous);
          next.set("page", String(Math.max(1, result.last_page)));
          return next;
        }, { replace: true });
        return;
      }
      setState({ key, result: result as PageResult<T> });
    }).catch((error: unknown) => {
      if (active) setState({ key, error: apiErrorMessage(error) });
    });
    return () => { active = false; };
  }, [type, page, category, query, key, setParams]);
  const updateParams = (name: string, value: string) => {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      if (value) next.set(name, value); else next.delete(name);
      if (name !== "page") next.delete("page");
      return next;
    }, { replace: name === "search" });
  };
  const result = state.key === key ? state.result : undefined;
  return {
    items: (result?.data ?? []) as PageResult<T>["data"], loading: state.key !== key,
    error: state.key === key ? state.error : undefined,
    page, lastPage: result?.last_page ?? 1, total: result?.total ?? 0,
    setPage: (value: number) => updateParams("page", String(value)),
    category, query,
    clearFilters: () => setParams(previous => {
      const next = new URLSearchParams(previous);
      next.delete("category"); next.delete("search"); next.delete("page");
      return next;
    }),
    setCategory: (value: string) => updateParams("category", value === "All" ? "" : value),
    setQuery: (value: string) => updateParams("search", value),
  };
}

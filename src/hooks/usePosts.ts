import { useEffect, useState } from "react";
import type { BlogPost } from "../data/blog";
import { apiErrorMessage, fetchPosts } from "../lib/api";

export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchPosts()
      .then((data) => active && setPosts(data))
      .catch((requestError) => active && setError(apiErrorMessage(requestError)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { posts, loading, error };
}

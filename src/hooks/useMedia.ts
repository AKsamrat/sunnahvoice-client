import { useEffect, useState } from "react";
import type { MediaItem, MediaType } from "../data/media";
import { apiErrorMessage, fetchMedia } from "../lib/api";

export function useMedia(type?: MediaType, limit = 50) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMedia(type, limit)
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((requestError) => {
        if (active) setError(apiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [type, limit]);

  return { items, loading, error };
}

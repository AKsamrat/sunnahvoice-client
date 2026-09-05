import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../lib/api";

let memoryVisitorId: string | undefined;
function visitorId() {
  if (memoryVisitorId) return memoryVisitorId;
  const key = "sunnahvoice_visitor_id";
  try {
    const saved = localStorage.getItem(key);
    if (saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved)) return memoryVisitorId = saved;
  } catch { /* Continue with an in-memory ID when storage is unavailable. */ }
  memoryVisitorId = crypto.randomUUID();
  try { localStorage.setItem(key, memoryVisitorId); } catch { /* Storage is optional. */ }
  return memoryVisitorId;
}

export default function VisitorTracker() {
  const { pathname } = useLocation();
  const previousPath = useRef<string | null>(null);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (/^\/(dashboard|login|register)(\/|$)/.test(pathname)) return;
    try {
      void api.post("/visits", { visitor_id: visitorId(), event_id: crypto.randomUUID(), path: pathname }).catch(() => {
        // Analytics must never interrupt browsing.
      });
    } catch { /* Browsing also works when browser ID generation is unavailable. */ }
  }, [pathname]);
  return null;
}

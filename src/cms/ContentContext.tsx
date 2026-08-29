import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_CONTENT, InboxMessage, SiteContent } from "./defaultContent";

const CONTENT_KEY = "parmis_cms_content_v2";
const INBOX_KEY = "parmis_cms_inbox_v1";

function deepMerge<T>(base: T, patch: Partial<T> | null | undefined): T {
  if (!patch) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as unknown as T;
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    const p = patch as Record<string, unknown>;
    for (const key of Object.keys(p)) {
      const b = (base as Record<string, unknown>)[key];
      if (b && typeof b === "object" && p[key] && typeof p[key] === "object") {
        out[key] = deepMerge(b, p[key] as never);
      } else if (p[key] !== undefined) {
        out[key] = p[key];
      }
    }
    return out as T;
  }
  return (patch ?? base) as T;
}

function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (raw) return deepMerge(DEFAULT_CONTENT, JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return DEFAULT_CONTENT;
}

function loadInbox(): InboxMessage[] {
  try {
    const raw = localStorage.getItem(INBOX_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

export const uid = () => Math.random().toString(36).slice(2, 10);

interface CmsContextValue {
  content: SiteContent;
  inbox: InboxMessage[];
  lastSaved: number;
  update: (mutator: (draft: SiteContent) => SiteContent) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
  addInbox: (msg: Omit<InboxMessage, "id" | "date" | "read">) => void;
  updateInbox: (id: string, patch: Partial<InboxMessage>) => void;
  removeInbox: (id: string) => void;
  clearInbox: () => void;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);
  const [inbox, setInbox] = useState<InboxMessage[]>(loadInbox);
  const [lastSaved, setLastSaved] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
      setLastSaved(Date.now());
    }, 250);
    return () => clearTimeout(t);
  }, [content]);

  useEffect(() => {
    localStorage.setItem(INBOX_KEY, JSON.stringify(inbox));
  }, [inbox]);

  const update = useCallback((mutator: (draft: SiteContent) => SiteContent) => {
    setContent((prev) => mutator(structuredClone(prev)));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(CONTENT_KEY);
    setContent(structuredClone(DEFAULT_CONTENT));
  }, []);

  const exportJson = useCallback(() => JSON.stringify(content, null, 2), [content]);

  const importJson = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json);
        if (parsed && parsed.settings && parsed.services) {
          setContent(deepMerge(DEFAULT_CONTENT, parsed));
          return true;
        }
      } catch {
        /* ignore */
      }
      return false;
    },
    []
  );

  const addInbox = useCallback((msg: Omit<InboxMessage, "id" | "date" | "read">) => {
    const fa = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" });
    setInbox((prev) => [{ ...msg, id: uid(), date: fa.format(new Date()), read: false }, ...prev]);
  }, []);

  const updateInbox = useCallback((id: string, patch: Partial<InboxMessage>) => {
    setInbox((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const removeInbox = useCallback((id: string) => {
    setInbox((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearInbox = useCallback(() => setInbox([]), []);

  const value = useMemo(
    () => ({ content, inbox, lastSaved, update, resetAll, exportJson, importJson, addInbox, updateInbox, removeInbox, clearInbox }),
    [content, inbox, lastSaved, update, resetAll, exportJson, importJson, addInbox, updateInbox, removeInbox, clearInbox]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}

export const toFa = (v: number | string) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_CONTENT, InboxMessage, SiteContent } from "./defaultContent";

const CONTENT_KEY = "parmis_cms_content_v2";
const INBOX_KEY = "parmis_cms_inbox_v1";

/* ---------- ذخیره‌سازی چندلایه و ضدخطا ----------
   برخی محیط‌ها (مثل iframe پیش‌نمایش) دسترسی به localStorage را مسدود می‌کنند؛
   در آن حالت به sessionStorage و سپس حافظه موقت داخل صفحه رجوع می‌شود. */
export type StorageMode = "local" | "session" | "memory";
const memStore = new Map<string, string>();
let detectedMode: StorageMode = "memory";

function storageGet(key: string): string | null {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) { detectedMode = "local"; return v; }
  } catch { /* مسدود */ }
  try {
    const v = sessionStorage.getItem(key);
    if (v !== null) { if (detectedMode !== "local") detectedMode = "session"; return v; }
  } catch { /* مسدود */ }
  const m = memStore.get(key);
  if (m !== undefined && detectedMode === "memory") detectedMode = "memory";
  return m ?? null;
}

function storageSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); detectedMode = "local"; return; } catch { /* مسدود */ }
  try { sessionStorage.setItem(key, value); detectedMode = "session"; return; } catch { /* مسدود */ }
  memStore.set(key, value);
  detectedMode = "memory";
}

function storageRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* مسدود */ }
  try { sessionStorage.removeItem(key); } catch { /* مسدود */ }
  memStore.delete(key);
}

export const getStorageMode = (): StorageMode => detectedMode;

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
    const raw = storageGet(CONTENT_KEY);
    if (raw) return deepMerge(DEFAULT_CONTENT, JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return DEFAULT_CONTENT;
}

function loadInbox(): InboxMessage[] {
  try {
    const raw = storageGet(INBOX_KEY);
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
  storageMode: StorageMode;
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
  const [storageMode, setStorageMode] = useState<StorageMode>(() => getStorageMode());

  useEffect(() => {
    const t = setTimeout(() => {
      storageSet(CONTENT_KEY, JSON.stringify(content));
      setLastSaved(Date.now());
      setStorageMode(getStorageMode());
    }, 150);
    return () => clearTimeout(t);
  }, [content]);

  useEffect(() => {
    storageSet(INBOX_KEY, JSON.stringify(inbox));
    setStorageMode(getStorageMode());
  }, [inbox]);

  /* ذخیره دوره‌ای بیمه‌کننده: حتی اگر افکت‌ها به هر دلیل از قلم بیفتند،
     هر ۴ ثانیه آخرین وضعیت در پایدارترین حافظه ممکن ثبت می‌شود */
  useEffect(() => {
    const iv = setInterval(() => {
      storageSet(CONTENT_KEY, JSON.stringify(content));
      storageSet(INBOX_KEY, JSON.stringify(inbox));
      setStorageMode(getStorageMode());
    }, 4000);
    return () => clearInterval(iv);
  }, [content, inbox]);

  const update = useCallback((mutator: (draft: SiteContent) => SiteContent) => {
    setContent((prev) => mutator(structuredClone(prev)));
  }, []);

  const resetAll = useCallback(() => {
    storageRemove(CONTENT_KEY);
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
    () => ({ content, inbox, lastSaved, storageMode, update, resetAll, exportJson, importJson, addInbox, updateInbox, removeInbox, clearInbox }),
    [content, inbox, lastSaved, storageMode, update, resetAll, exportJson, importJson, addInbox, updateInbox, removeInbox, clearInbox]
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

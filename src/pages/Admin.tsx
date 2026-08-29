import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { uid, useCms } from "../cms/ContentContext";
import { SiteContent } from "../cms/defaultContent";
import {
  IconArrow, IconArrowUpLeft, IconCheck, IconClose, IconDownload, IconEdit, IconEye, IconMail, IconPlus, IconTrash, IconUpload, LogoMark,
} from "../components/ui";

/* ---------- schema definitions ---------- */
type FieldDef = { key: string; label: string; type: "text" | "textarea" | "lines" | "select" | "check"; options?: string[] };
type CollDef = { key: keyof SiteContent; label: string; singular: string; fields: FieldDef[]; preview: string };

const COLLECTIONS: CollDef[] = [
  {
    key: "services", label: "خدمات", singular: "خدمت", preview: "title",
    fields: [
      { key: "title", label: "عنوان خدمت", type: "text" },
      { key: "desc", label: "توضیحات", type: "textarea" },
      { key: "icon", label: "آیکون", type: "select", options: ["web", "theme", "plugin", "plan", "ai", "rocket", "compass", "system"] },
      { key: "span", label: "اندازه کارت در صفحه اصلی", type: "select", options: ["wide", "narrow", "full"] },
      { key: "features", label: "ویژگی‌ها (هر خط یکی)", type: "lines" },
    ],
  },
  {
    key: "projects", label: "نمونه‌کارها", singular: "پروژه", preview: "title",
    fields: [
      { key: "title", label: "عنوان پروژه", type: "text" },
      { key: "category", label: "دسته‌بندی", type: "text" },
      { key: "desc", label: "توضیح کوتاه", type: "textarea" },
      { key: "result", label: "نتیجه پروژه (عدد/دستاورد)", type: "text" },
      { key: "year", label: "سال", type: "text" },
      { key: "hue", label: "رنگ کاور", type: "select", options: ["0", "1", "2", "3"] },
      { key: "tech", label: "تکنولوژی‌ها (هر خط یکی)", type: "lines" },
    ],
  },
  {
    key: "courses", label: "دوره‌ها", singular: "دوره", preview: "title",
    fields: [
      { key: "title", label: "عنوان دوره", type: "text" },
      { key: "desc", label: "توضیحات", type: "textarea" },
      { key: "level", label: "سطح", type: "select", options: ["مقدماتی", "متوسط", "پیشرفته"] },
      { key: "duration", label: "مدت (مثلاً ۱۸ ساعت)", type: "text" },
      { key: "sessions", label: "تعداد جلسات", type: "text" },
      { key: "price", label: "قیمت", type: "text" },
      { key: "featured", label: "دوره ویژه صفحه اول باشد؟", type: "check" },
      { key: "syllabus", label: "سرفصل‌ها (هر خط یکی)", type: "lines" },
    ],
  },
  {
    key: "testimonials", label: "نظر مشتری‌ها", singular: "نظر", preview: "name",
    fields: [
      { key: "name", label: "نام", type: "text" },
      { key: "role", label: "سمت", type: "text" },
      { key: "project", label: "پروژه مرتبط", type: "text" },
      { key: "quote", label: "متن نظر", type: "textarea" },
    ],
  },
  {
    key: "collabTypes", label: "انواع همکاری", singular: "نوع همکاری", preview: "title",
    fields: [
      { key: "title", label: "عنوان", type: "text" },
      { key: "desc", label: "توضیحات", type: "textarea" },
      { key: "icon", label: "آیکون", type: "select", options: ["rocket", "compass", "handshake", "system"] },
    ],
  },
  {
    key: "steps", label: "مراحل فرآیند (صفحه اصلی)", singular: "مرحله", preview: "title",
    fields: [
      { key: "title", label: "عنوان مرحله", type: "text" },
      { key: "desc", label: "توضیح کوتاه", type: "textarea" },
    ],
  },
];

const SETTINGS_FIELDS: FieldDef[] = [
  { key: "brandName", label: "نام برند", type: "text" },
  { key: "studioName", label: "نام کامل استودیو", type: "text" },
  { key: "tagline", label: "شعار/توضیح برند", type: "text" },
  { key: "heroBadge", label: "متن بج بالای صفحه اصلی", type: "text" },
  { key: "heroTitle", label: "خط اول تیتر صفحه اصلی", type: "text" },
  { key: "heroHighlight", label: "خط هایلایت تیتر (افکت رمزگشایی)", type: "text" },
  { key: "heroDesc", label: "توضیح زیر تیتر", type: "textarea" },
  { key: "phone", label: "شماره تماس", type: "text" },
  { key: "email", label: "ایمیل", type: "text" },
  { key: "workHours", label: "ساعات پاسخ‌گویی", type: "text" },
  { key: "location", label: "موقعیت", type: "text" },
  { key: "instagram", label: "لینک اینستاگرام (اختیاری)", type: "text" },
  { key: "telegram", label: "لینک تلگرام (اختیاری)", type: "text" },
];

type Tab = "dashboard" | "inbox" | (typeof COLLECTIONS)[number]["key"] | "settings" | "tech";

function blankItem(fields: FieldDef[]) {
  const it: Record<string, unknown> = { id: uid() };
  fields.forEach((f) => {
    if (f.type === "lines") it[f.key] = [];
    else if (f.type === "check") it[f.key] = false;
    else if (f.type === "select") it[f.key] = f.options?.[0] ?? "";
    else it[f.key] = "";
  });
  return it;
}

/* ---------- login gate ---------- */
const AUTH_KEY = "parmis_admin_auth";
const ADMIN_USER = "parmis_business";
const ADMIN_PASS = "Tedi_Sadra 90";

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(AUTH_KEY, "1");
        onSuccess();
      } else {
        setError("نام کاربری یا رمز عبور اشتباه است!");
        setShakeKey((k) => k + 1);
        setLoading(false);
      }
    }, 700);
  };

  return (
    <section className="flex min-h-screen items-center pt-[74px]">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        {/* brand side */}
        <div className="relative hidden lg:block">
          <div className="relative mx-auto w-fit">
            <svg viewBox="0 0 340 340" className="h-[330px] w-[330px]">
              <g className="spin-slower" style={{ transformOrigin: "170px 170px" }}>
                <circle cx="170" cy="170" r="150" fill="none" stroke="#9d6bff" strokeOpacity="0.25" strokeDasharray="3 9" />
                <circle cx="170" cy="20" r="6" fill="#ff6ad5" />
              </g>
              <g className="spin-slow" style={{ transformOrigin: "170px 170px" }}>
                <circle cx="170" cy="170" r="112" fill="none" stroke="#e8b45a" strokeOpacity="0.3" strokeDasharray="1 7" />
                <circle cx="282" cy="170" r="4.5" fill="#e8b45a" />
              </g>
              <circle cx="170" cy="170" r="74" fill="none" stroke="#9d6bff" strokeOpacity="0.5" />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <LogoMark className="float-y h-24 w-24" />
            </div>
          </div>
          <h2 className="mt-10 text-center font-display text-4xl leading-snug text-white">
            فرماندهی <span className="text-glow text-violet">سیستم دیجیتال</span> شما
          </h2>
          <ul className="mx-auto mt-7 max-w-sm space-y-3.5">
            {["ویرایش خدمات، نمونه‌کارها و دوره‌ها", "مدیریت پیام‌ها و پیشنهادهای همکاری", "پشتیبان‌گیری و بازگردانی محتوا"].map((f) => (
              <li key={f} className="flex items-center gap-3 text-[14px] font-semibold text-mist">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet/15 text-violet">
                  <IconCheck className="h-3.5 w-3.5" strokeWidth={2.6} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* form side */}
        <div key={shakeKey} className={`mx-auto w-full max-w-md ${shakeKey > 0 ? "shake" : ""}`}>
          <div className="rounded-3xl border border-line bg-surface/80 p-8 shadow-[0_30px_90px_-30px_rgba(109,61,240,0.45)] backdrop-blur lg:p-10">
            <div className="flex items-center gap-4 lg:hidden">
              <LogoMark className="h-12 w-12" />
              <div>
                <h2 className="font-display text-2xl text-white">پیشخوان مدیریت</h2>
                <p className="text-[12px] text-fog">ورود فقط برای مدیر سایت</p>
              </div>
            </div>
            <div className="hidden lg:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-4 py-1.5 text-[12px] font-bold text-lilac">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-violet" />
                ناحیه حفاظت‌شده
              </span>
            </div>
            <h3 className="mt-5 font-display text-[26px] text-white lg:mt-6">ورود به پیشخوان مدیریت</h3>
            <p className="mt-2 text-[13.5px] leading-7 text-mist">برای ویرایش محتوای سایت، نام کاربری و رمز عبور خود را وارد کنید.</p>

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-[13px] font-bold text-lilac">نام کاربری</label>
                <input
                  dir="ltr"
                  autoComplete="username"
                  className="login-field"
                  placeholder="username"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-bold text-lilac">رمز عبور</label>
                <div className="relative">
                  <input
                    dir="ltr"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    className="login-field pl-12"
                    placeholder="••••••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${show ? "text-violet" : "text-fog hover:text-lilac"}`}
                    aria-label="نمایش رمز"
                  >
                    <IconEye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-[13px] font-bold text-magenta">
                  <IconClose className="h-4 w-4 shrink-0" strokeWidth={2.4} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-shine flex w-full items-center justify-center gap-2.5 rounded-xl bg-violet py-3.5 text-[15px] font-extrabold text-ink transition-all duration-300 hover:bg-lilac hover:shadow-[0_0_40px_rgba(157,107,255,0.5)] disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                    در حال بررسی...
                  </>
                ) : (
                  <>
                    ورود به پیشخوان
                    <IconArrowUpLeft className="h-4.5 w-4.5" strokeWidth={2.4} />
                  </>
                )}
              </button>
            </form>

            <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-[13px] font-bold text-fog transition-colors hover:text-violet">
              <IconArrow className="h-4 w-4" />
              بازگشت به سایت
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Admin() {
  const { content, update, inbox, updateInbox, removeInbox, clearInbox, exportJson, importJson, resetAll, lastSaved } = useCms();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === "1");

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2600);
  };

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: "dashboard", label: "پیشخوان" },
    { id: "inbox", label: "صندوق پیام‌ها", badge: inbox.filter((m) => !m.read).length },
    ...COLLECTIONS.map((c) => ({ id: c.key as Tab, label: c.label, badge: (content[c.key] as unknown[]).length })),
    { id: "tech", label: "تکنولوژی‌ها (مارکی)", badge: content.techStack.length },
    { id: "settings", label: "تنظیمات سایت" },
  ];

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const ok = importJson(String(r.result));
      notify(ok ? "محتوا با موفقیت وارد شد ✓" : "فایل معتبر نیست!", ok);
    };
    r.readAsText(f);
    e.target.value = "";
  };

  const onExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "parmis-content.json";
    a.click();
    URL.revokeObjectURL(a.href);
    notify("فایل پشتیبان دانلود شد ✓");
  };

  const setField = (coll2: CollDef, idx2: number, key2: string, value: unknown) => (d: SiteContent): SiteContent => {
    ((d[coll2.key] as unknown as Record<string, unknown>[])[idx2] as Record<string, unknown>)[key2] = value;
    return d;
  };

  const renderCollection = (coll: CollDef) => {
    const items = content[coll.key] as unknown as Record<string, unknown>[];
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-white">{coll.label}</h2>
            <p className="mt-1 text-[12.5px] text-fog">تغییرات بلافاصله در سایت اعمال و به‌صورت خودکار ذخیره می‌شوند.</p>
          </div>
          <button
            onClick={() => update((d) => ({ ...d, [coll.key]: [...(d[coll.key] as unknown[]), blankItem(coll.fields)] }) as SiteContent)}
            className="inline-flex items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-[13.5px] font-extrabold text-ink transition-all hover:bg-lilac"
          >
            <IconPlus className="h-4 w-4" strokeWidth={2.4} /> افزودن {coll.singular} جدید
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <details key={String(item.id)} className="group rounded-2xl border border-line bg-surface/70 open:border-violet/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet/12 font-display text-lg text-violet">
                    {["۱","۲","۳","۴","۵","۶","۷","۸","۹","۰"][idx % 10]}
                  </span>
                  <span className="text-[14.5px] font-bold text-white">{String((item as Record<string, unknown>)[coll.preview] || "بدون عنوان")}</span>
                </div>
                <span className="flex items-center gap-2 text-[12px] text-fog">
                  <IconEdit className="h-4 w-4 text-violet" /> ویرایش
                </span>
              </summary>
              <div className="grid gap-4 border-t border-line-soft p-5 sm:grid-cols-2">
                {coll.fields.map((f) => (
                  <div key={f.key} className={f.type === "textarea" || f.type === "lines" ? "sm:col-span-2" : ""}>
                    <label className="mb-1.5 block text-[12px] font-bold text-lilac">{f.label}</label>
                    {f.type === "text" && (
                      <input
                        className="field text-[13.5px]"
                        value={String((item as Record<string, unknown>)[f.key] ?? "")}
                        onChange={(e) => update(setField(coll, idx, f.key, e.target.value))}
                      />
                    )}
                    {f.type === "textarea" && (
                      <textarea
                        className="field min-h-[90px] resize-y text-[13.5px]"
                        value={String((item as Record<string, unknown>)[f.key] ?? "")}
                        onChange={(e) => update(setField(coll, idx, f.key, e.target.value))}
                      />
                    )}
                    {f.type === "lines" && (
                      <textarea
                        className="field min-h-[90px] resize-y text-[13.5px]"
                        value={(((item as Record<string, unknown>)[f.key] ?? []) as string[]).join("\n")}
                        onChange={(e) => update(setField(coll, idx, f.key, e.target.value.split("\n").filter((x) => x.trim())))}
                      />
                    )}
                    {f.type === "select" && (
                      <select
                        className="field text-[13.5px]"
                        value={String((item as Record<string, unknown>)[f.key] ?? "")}
                        onChange={(e) => update(setField(coll, idx, f.key, e.target.value))}
                      >
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                    {f.type === "check" && (
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-ink/50 px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4.5 w-4.5 accent-[#9d6bff]"
                          checked={Boolean((item as Record<string, unknown>)[f.key])}
                          onChange={(e) => update(setField(coll, idx, f.key, e.target.checked))}
                        />
                        <span className="text-[13px] font-semibold text-mist">فعال</span>
                      </label>
                    )}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <button
                    onClick={() => {
                      update((d) => ({ ...d, [coll.key]: (d[coll.key] as unknown[]).filter((_, i) => i !== idx) }) as SiteContent);
                      notify("آیتم حذف شد");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-magenta/40 px-5 py-2.5 text-[13px] font-bold text-magenta transition-all hover:bg-magenta/15"
                  >
                    <IconTrash className="h-4 w-4" /> حذف این {coll.singular}
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-[74px]">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* admin header */}
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-line bg-gradient-to-l from-surface to-surface-2 p-7">
          <div>
            <h1 className="font-display text-3xl text-white">پیشخوان مدیریت محتوا</h1>
            <p className="mt-1.5 text-[13.5px] text-mist">
              مثل وردپرس، ولی ساده‌تر — هر چیزی را تغییر دهید، همان لحظه در سایت اعمال و ذخیره می‌شود.
              {lastSaved > 0 && (
                <span className="mr-2 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-gold">
                  <IconCheck className="h-3.5 w-3.5" strokeWidth={2.6} />
                  ذخیره شد · {new Date(lastSaved).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[13px] font-bold text-lilac transition-all hover:border-violet">
              <IconEye className="h-4 w-4" /> مشاهده سایت
            </Link>
            <button onClick={onExport} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[13px] font-bold text-lilac transition-all hover:border-violet">
              <IconDownload className="h-4 w-4" /> پشتیبان‌گیری
            </button>
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-[13px] font-bold text-lilac transition-all hover:border-violet">
              <IconUpload className="h-4 w-4" /> وارد کردن
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={onImportFile} />
            <button
              onClick={() => { if (window.confirm("همه تغییرات به حالت پیش‌فرض برمی‌گردد. مطمئن هستید؟")) { resetAll(); notify("به حالت پیش‌فرض برگشت"); } }}
              className="inline-flex items-center gap-2 rounded-full border border-magenta/40 px-5 py-2.5 text-[13px] font-bold text-magenta transition-all hover:bg-magenta/15"
            >
              <IconTrash className="h-4 w-4" /> بازنشانی
            </button>
            <button
              onClick={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[13px] font-bold text-gold transition-all hover:bg-gold/15"
            >
              <IconClose className="h-4 w-4" /> خروج از حساب
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* sidebar */}
          <aside>
            <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[13.5px] font-bold transition-all duration-300 ${
                    tab === t.id ? "border-violet bg-violet/15 text-white" : "border-line bg-surface/60 text-mist hover:border-violet/50 hover:text-white"
                  }`}
                >
                  {t.label}
                  {typeof t.badge === "number" && (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${tab === t.id ? "bg-violet text-ink" : "bg-ink/70 text-fog"}`}>
                      {t.badge > 0 ? new Intl.NumberFormat("fa-IR").format(t.badge) : "۰"}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* content */}
          <main className="min-w-0">
            {tab === "dashboard" && (
              <div>
                <h2 className="font-display text-2xl text-white">پیشخوان</h2>
                <p className="mt-1 text-[13px] text-fog">نمای کلی از وضعیت محتوای سایت شما</p>
                <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "پیام‌های نخوانده", value: inbox.filter((m) => !m.read && m.kind === "message").length, gold: false },
                    { label: "پیشنهادهای همکاری", value: inbox.filter((m) => m.kind === "proposal").length, gold: true },
                    { label: "خدمات فعال", value: content.services.length, gold: false },
                    { label: "نمونه‌کارها", value: content.projects.length, gold: false },
                    { label: "دوره‌های فعال", value: content.courses.length, gold: false },
                    { label: "نظرات مشتری‌ها", value: content.testimonials.length, gold: true },
                  ].map((c) => (
                    <div key={c.label} className="card-3d rounded-2xl border border-line bg-surface/70 p-6">
                      <div className={`font-display text-4xl ${c.gold ? "text-gold" : "text-violet"}`}>{new Intl.NumberFormat("fa-IR").format(c.value)}</div>
                      <div className="mt-2 text-[13px] font-bold text-mist">{c.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl border border-violet/30 bg-violet/8 p-6">
                  <h3 className="flex items-center gap-2.5 font-display text-xl text-white"><IconMail className="h-5 w-5 text-violet" /> راهنمای سریع</h3>
                  <ul className="mt-4 space-y-2.5 text-[13.5px] leading-7 text-mist">
                    <li>۱. از منوی کنار، بخش موردنظر را باز کنید (خدمات، دوره‌ها، نمونه‌کارها و…).</li>
                    <li>۲. روی «ویرایش» هر آیتم کلیک کنید تا فرم آن باز شود — تغییرات همان لحظه ذخیره می‌شود.</li>
                    <li>۳. پیام‌های فرم تماس و پیشنهادهای همکاری در «صندوق پیام‌ها» جمع می‌شوند.</li>
                    <li>۴. با «پشتیبان‌گیری» یک فایل JSON بگیرید و هر جا خواستید با «وارد کردن» برگردانید.</li>
                  </ul>
                </div>
              </div>
            )}

            {tab === "inbox" && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-white">صندوق پیام‌ها</h2>
                    <p className="mt-1 text-[12.5px] text-fog">پیام‌های فرم تماس و پیشنهادهای همکاری سایت — {new Intl.NumberFormat("fa-IR").format(inbox.length)} مورد</p>
                  </div>
                  {inbox.length > 0 && (
                    <button onClick={() => { if (window.confirm("همه پیام‌ها حذف شوند؟")) { clearInbox(); notify("صندوق خالی شد"); } }} className="inline-flex items-center gap-2 rounded-full border border-magenta/40 px-5 py-2.5 text-[13px] font-bold text-magenta transition-all hover:bg-magenta/15">
                      <IconTrash className="h-4 w-4" /> خالی کردن صندوق
                    </button>
                  )}
                </div>
                {inbox.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-line py-20 text-center">
                    <IconMail className="mx-auto h-10 w-10 text-fog" />
                    <p className="mt-4 text-[14px] font-bold text-mist">هنوز پیامی ندارید</p>
                    <p className="mt-1.5 text-[12.5px] text-fog">وقتی کسی از فرم تماس یا پیشنهاد همکاری پیام بفرستد، اینجا نمایش داده می‌شود.</p>
                  </div>
                )}
                <div className="space-y-4">
                  {inbox.map((m) => (
                    <div key={m.id} className={`rounded-2xl border p-6 transition-colors ${m.read ? "border-line-soft bg-surface/40" : "border-violet/40 bg-surface/80"}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-[11.5px] font-extrabold ${m.kind === "proposal" ? "bg-gold/15 text-gold" : "bg-violet/15 text-lilac"}`}>
                            {m.kind === "proposal" ? "پیشنهاد همکاری" : "پیام"}
                          </span>
                          <span className="text-[14.5px] font-extrabold text-white">{m.name}</span>
                          <span className="ltr text-[12.5px] text-fog">{m.contact}</span>
                        </div>
                        <span className="text-[12px] text-fog">{m.date}</span>
                      </div>
                      <div className="mt-3 text-[13.5px] font-bold text-lilac">{m.subject}</div>
                      <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-7 text-mist">{m.body}</p>
                      <div className="mt-4 flex gap-3">
                        {!m.read && (
                          <button onClick={() => updateInbox(m.id, { read: true })} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12px] font-bold text-lilac transition-all hover:border-violet">
                            <IconCheck className="h-3.5 w-3.5" /> خوانده شد
                          </button>
                        )}
                        <a href={`mailto:${m.contact.includes("@") ? m.contact : ""}`} className={`inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12px] font-bold text-lilac transition-all hover:border-violet ${m.contact.includes("@") ? "" : "pointer-events-none opacity-40"}`}>
                          <IconMail className="h-3.5 w-3.5" /> پاسخ با ایمیل
                        </a>
                        <button onClick={() => { removeInbox(m.id); notify("پیام حذف شد"); }} className="inline-flex items-center gap-1.5 rounded-full border border-magenta/40 px-4 py-2 text-[12px] font-bold text-magenta transition-all hover:bg-magenta/15">
                          <IconTrash className="h-3.5 w-3.5" /> حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {COLLECTIONS.filter((c) => c.key === tab).map((c) => (
              <div key={c.key}>{renderCollection(c)}</div>
            ))}

            {tab === "tech" && (
              <div>
                <h2 className="font-display text-2xl text-white">تکنولوژی‌های مارکی</h2>
                <p className="mt-1 text-[12.5px] text-fog">این لیست در نوار متحرک صفحه اصلی نمایش داده می‌شود — هر خط یک آیتم.</p>
                <textarea
                  className="field mt-6 min-h-[220px] resize-y text-[13.5px]"
                  value={content.techStack.join("\n")}
                  onChange={(e) => update((d) => ({ ...d, techStack: e.target.value.split("\n").filter((x) => x.trim()) }))}
                />
              </div>
            )}

            {tab === "settings" && (
              <div>
                <h2 className="font-display text-2xl text-white">تنظیمات سایت</h2>
                <p className="mt-1 text-[12.5px] text-fog">اطلاعات برند و تماس — در همه صفحات سایت استفاده می‌شود.</p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {SETTINGS_FIELDS.map((f) => (
                    <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                      <label className="mb-1.5 block text-[12px] font-bold text-lilac">{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea
                          className="field min-h-[90px] resize-y text-[13.5px]"
                          value={(content.settings as unknown as Record<string, string>)[f.key] ?? ""}
                          onChange={(e) => update((d) => ({ ...d, settings: { ...d.settings, [f.key]: e.target.value } }))}
                        />
                      ) : (
                        <input
                          className="field text-[13.5px]"
                          value={(content.settings as unknown as Record<string, string>)[f.key] ?? ""}
                          onChange={(e) => update((d) => ({ ...d, settings: { ...d.settings, [f.key]: e.target.value } }))}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div className={`toast-in fixed bottom-7 left-1/2 z-[70] -translate-x-1/2 rounded-full border px-6 py-3 text-[13.5px] font-extrabold backdrop-blur ${toast.ok ? "border-violet/50 bg-surface/95 text-lilac" : "border-magenta/50 bg-surface/95 text-magenta"}`}>
          {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-bold text-fog transition-colors hover:text-violet">
          <IconArrowUpLeft className="h-4 w-4" /> بازگشت به سایت
        </Link>
      </div>
    </div>
  );
}

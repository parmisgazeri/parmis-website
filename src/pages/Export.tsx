import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { buildZip } from "../lib/zip";
import { PROJECT_FILES } from "virtual:project-files";
import { toFa } from "../cms/ContentContext";
import { Reveal, LogoMark, IconDownload, IconCheck, IconArrowUpLeft } from "../components/ui";

/* ─────────────────────────────────────────────────────────────
   صفحه دانلود سورس — سه راه برای بردن فایل‌ها:
   ۱) دکمه دانلود (تکی یا ZIP) — در مرورگر عادی کار می‌کند
   ۲) دکمه کپی برای هر فایل — همیشه کار می‌کند (پیست در GitHub)
   ۳) باز کردن صفحه در تب جدید — اگر پیش‌نمایش دانلود را ببندد
   ───────────────────────────────────────────────────────────── */

const ORDER: Record<string, number> = {};
PROJECT_FILES.forEach(([p], i) => { ORDER[p] = i; });

const GROUPS: { title: string; hint: string; match: (p: string) => boolean }[] = [
  { title: "اولویت ۱ — فایل‌های ریشه", hint: "اول این‌ها را بساز", match: (p) => !p.startsWith("src/") },
  { title: "اولویت ۲ — هسته برنامه", hint: "داخل پوشه src", match: (p) => p.startsWith("src/") && !p.startsWith("src/pages/") },
  { title: "اولویت ۳ — صفحه‌های سایت", hint: "داخل src/pages", match: (p) => p.startsWith("src/pages/") },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${toFa(bytes)} بایت`;
  if (bytes < 1024 * 1024) return `${toFa((bytes / 1024).toFixed(1))} کیلوبایت`;
  return `${toFa((bytes / (1024 * 1024)).toFixed(2))} مگابایت`;
}

/* کپی متن — با fallback برای مرورگرهای سخت‌گیر */
function copyText(text: string): Promise<boolean> {
  const legacy = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;left:-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    return ok;
  };
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => legacy());
  }
  return Promise.resolve(legacy());
}

export default function Export() {
  const [state, setState] = useState<"idle" | "done">("idle");
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [viewFile, setViewFile] = useState<{ path: string; content: string } | null>(null);
  const [copiedPath, setCopiedPath] = useState("");

  const files = useMemo(
    () =>
      PROJECT_FILES.map(([path, content]) => ({ path, content, size: new TextEncoder().encode(content).length })).sort(
        (a, b) => (ORDER[a.path] ?? 99) - (ORDER[b.path] ?? 99)
      ),
    []
  );
  const totalSize = useMemo(() => files.reduce((s, f) => s + f.size, 0), [files]);

  const saveBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const downloadAll = () => {
    saveBlob(buildZip(PROJECT_FILES, "parmis-website"), "parmis-website.zip");
    setState("done");
    setDownloaded(new Set(files.map((f) => f.path)));
    setTimeout(() => setState("idle"), 6000);
  };

  const downloadOne = (f: { path: string; content: string }) => {
    saveBlob(new Blob([f.content], { type: "text/plain;charset=utf-8" }), f.path.split("/").pop() || f.path);
    setDownloaded((prev) => new Set(prev).add(f.path));
  };

  const copyFile = async (f: { path: string; content: string }) => {
    if (await copyText(f.content)) {
      setCopiedPath(f.path);
      setTimeout(() => setCopiedPath(""), 2500);
    }
  };

  const copyViewed = async () => {
    if (!viewFile) return;
    if (await copyText(viewFile.content)) {
      setCopiedPath(viewFile.path);
      setTimeout(() => setCopiedPath(""), 2500);
    }
  };

  const gitCommands = `git init
git add .
git commit -m "Parmis website"
git branch -M main
git remote add origin https://github.com/USERNAME/parmis-website.git
git push -u origin main`;

  const doneCount = downloaded.size;

  const Row = ({ f }: { f: (typeof files)[number] }) => {
    const isDone = downloaded.has(f.path) || copiedPath === f.path;
    const isCopied = copiedPath === f.path;
    return (
      <li
        className="group flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-line hover:bg-violet/5"
        style={{ animation: "fadeUp .45s both" }}
      >
        <span dir="ltr" className="flex min-w-0 items-center gap-2.5 text-left font-mono text-[12px] text-mist group-hover:text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={`h-4 w-4 shrink-0 ${f.path.endsWith(".tsx") || f.path.endsWith(".ts") ? "text-violet" : f.path.endsWith(".css") ? "text-magenta" : f.path.endsWith(".json") ? "text-gold" : "text-fog"}`}>
            <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3Z" strokeLinejoin="round" />
            <path d="M13.5 3v5.5H19" strokeLinejoin="round" />
          </svg>
          <span className="truncate">{f.path}</span>
          <span className="shrink-0 text-[10.5px] text-fog">{formatSize(f.size)}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => setViewFile({ path: f.path, content: f.content })}
            className="rounded-full border border-line px-3 py-1.5 text-[11px] font-bold text-fog transition-all hover:border-lilac hover:text-lilac"
          >
            نمایش
          </button>
          <button
            onClick={() => copyFile(f)}
            className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${isCopied ? "border-gold/60 bg-gold/15 text-gold" : "border-line text-fog hover:border-gold hover:text-gold"}`}
          >
            {isCopied ? "✓ کپی شد" : "کپی"}
          </button>
          <button
            onClick={() => downloadOne(f)}
            className={`w-[86px] rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${
              isDone && !isCopied ? "border-gold/60 bg-gold/15 text-gold" : "border-line text-fog hover:border-violet hover:text-lilac"
            }`}
          >
            {isDone && !isCopied ? "✓ دانلود شد" : "دانلود"}
          </button>
        </span>
      </li>
    );
  };

  return (
    <div className="relative pt-[74px]">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        {/* header */}
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Reveal>
              <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-bold text-fog transition-colors hover:text-violet">
                <IconArrowUpLeft className="h-4 w-4" /> بازگشت به سایت
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-4 font-display text-[38px] leading-[1.25] text-white sm:text-5xl">
                دانلود سورس پروژه
                <span className="text-glow block text-violet">همه فایل‌ها، آماده گیت‌هاب</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 max-w-xl text-[14.5px] leading-8 text-mist">
                {toFa(files.length)} فایل · {formatSize(totalSize)} — دونه‌دونه دانلود یا کپی کن، یا همه را یکجا ZIP بگیر.
              </p>
            </Reveal>
          </div>
          <Reveal delay={220} className="flex items-center gap-4">
            <LogoMark className="h-16 w-16" />
            <div className="rounded-2xl border border-line bg-surface/70 px-5 py-3.5 text-center">
              <span className="block font-display text-3xl text-violet">{toFa(doneCount)}<span className="text-lg text-fog">/{toFa(files.length)}</span></span>
              <span className="block text-[11.5px] font-bold text-fog">فایل گرفته شد</span>
            </div>
          </Reveal>
        </div>

        {/* notice — اگر دانلود کار نکرد */}
        <Reveal delay={120}>
          <div className="mt-9 flex flex-col gap-4 rounded-3xl border border-gold/35 bg-gold/[0.06] p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mt-1 h-7 w-7 shrink-0 text-gold">
                <path d="M9.5 18.5h5M10 21.5h4" />
                <path d="M12 2.5a6 6 0 0 0-3.5 10.9c.8.6 1 1.6 1 2.6h5c0-1 .2-2 1-2.6A6 6 0 0 0 12 2.5Z" />
              </svg>
              <div>
                <h3 className="font-display text-[19px] text-gold">دکمه دانلود چیزی ذخیره نمی‌کند؟</h3>
                <p className="mt-1.5 max-w-2xl text-[13px] leading-7 text-mist">
                  محیط پیش‌نمایش گاهی جلوی ذخیره فایل را می‌گیرد. دو راه داری:
                  <b className="text-white"> ۱)</b> دکمه «باز کردن در تب جدید» را بزن و از آنجا دانلود کن.
                  <b className="text-white"> ۲)</b> از دکمه «کپی» هر فایل استفاده کن و محتوا را در صفحه GitHub پیست کن — این راه همیشه جواب می‌دهد.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.open(window.location.href, "_blank")}
              className="shrink-0 rounded-full border-2 border-gold/70 px-6 py-3 text-[13.5px] font-extrabold text-gold transition-all hover:bg-gold hover:text-ink hover:shadow-[0_0_34px_rgba(232,180,90,0.45)]"
            >
              ↗ باز کردن در تب جدید
            </button>
          </div>
        </Reveal>

        {/* big zip button */}
        <Reveal delay={160}>
          <button
            onClick={downloadAll}
            className={`btn-shine group relative mt-6 flex w-full items-center justify-center gap-4 overflow-hidden rounded-3xl border px-8 py-7 text-[18px] font-extrabold transition-all duration-500 ${
              state === "done"
                ? "border-gold/60 bg-gold/15 text-gold shadow-[0_0_60px_rgba(232,180,90,0.25)]"
                : "border-violet/60 bg-violet text-ink hover:bg-lilac hover:shadow-[0_0_70px_rgba(157,107,255,0.5)]"
            }`}
          >
            {state === "done" ? (
              <>
                <IconCheck className="h-6 w-6" strokeWidth={2.6} />
                ZIP ساخته شد — اگر در Downloads نیست، از تب جدید باز کن
              </>
            ) : (
              <>
                <IconDownload className="h-6 w-6 transition-transform duration-500 group-hover:translate-y-1" strokeWidth={2.2} />
                دانلود همه {toFa(files.length)} فایل به‌صورت ZIP
              </>
            )}
          </button>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* file list */}
          <Reveal delay={200}>
            <div className="rounded-3xl border border-line bg-surface/70 p-6">
              <div className="flex items-center justify-between border-b border-line-soft pb-4">
                <h3 className="font-display text-[19px] text-white">فایل‌ها به ترتیب اولویت</h3>
                <span className="rounded-full bg-violet/15 px-3 py-1 text-[11.5px] font-extrabold text-violet">{toFa(files.length)} فایل</span>
              </div>

              {GROUPS.map((g) => {
                const list = files.filter((f) => g.match(f.path));
                if (!list.length) return null;
                return (
                  <div key={g.title} className="mt-6 first:mt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[13.5px] font-extrabold text-lilac">{g.title}</h4>
                      <span className="text-[11px] font-bold text-fog">{g.hint}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {list.map((f) => <Row key={f.path} f={f} />)}
                    </ul>
                  </div>
                );
              })}

              <p className="mt-5 border-t border-line-soft pt-4 text-[12px] leading-6.5 text-fog">
                <span className="ltr font-bold">node_modules</span> و <span className="ltr font-bold">dist</span> عمداً نیستند — با <span className="ltr font-bold">npm install</span> و <span className="ltr font-bold">npm run build</span> خودشان ساخته می‌شوند.
              </p>
            </div>
          </Reveal>

          {/* guide */}
          <div className="space-y-6">
            <Reveal delay={240}>
              <div className="rounded-3xl border border-line bg-surface/70 p-7">
                <h3 className="font-display text-[21px] text-lilac">اگر از راه «کپی» می‌روی</h3>
                <ol className="mt-5 space-y-4">
                  {[
                    <>در GitHub، ریپازیتوری را بساز و واردش شو.</>,
                    <>بزن <b className="ltr text-violet">Add file → Create new file</b>.</>,
                    <>اسم را <b className="text-white">با پوشه‌اش</b> بنویس؛ مثلاً <b className="ltr text-gold">src/pages/Home.tsx</b> (با گذاشتن <b className="ltr text-gold">/</b> پوشه خودکار ساخته می‌شود).</>,
                    <>محتوای کپی‌شده را <b className="text-white">پیست</b> کن و <b className="ltr text-violet">Commit changes</b> را بزن.</>,
                    <>برای همه فایل‌ها تکرار کن — ترتیب مهم نیست.</>,
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-violet/50 bg-violet/10 font-display text-[16px] text-violet">
                        {["۱", "۲", "۳", "۴", "۵"][i]}
                      </span>
                      <p className="text-[13.5px] leading-7 text-mist">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="rounded-3xl border border-line bg-surface/70 p-7">
                <h3 className="font-display text-[21px] text-lilac">اگر ZIP دانلود شد</h3>
                <ol className="mt-5 space-y-4">
                  {[
                    <>ZIP را باز کن — پوشه <b className="ltr text-white">parmis-website</b> بیرون می‌آید.</>,
                    <>محتویاتش را مستقیم در GitHub آپلود کن (<b className="ltr text-violet">uploading an existing file</b>).</>,
                    <>یا با دستورات گیت (پایین صفحه) بفرست و بعد به <b className="text-white">Vercel</b> و دامنه‌ات وصل کن.</>,
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold/10 font-display text-[16px] text-gold">
                        {["۱", "۲", "۳"][i]}
                      </span>
                      <p className="text-[13.5px] leading-7 text-mist">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="rounded-3xl border border-line bg-surface/70 p-7">
                <h3 className="font-display text-[21px] text-lilac">دستورات گیت (آماده کپی)</h3>
                <button
                  onClick={() => copyText(gitCommands).then((ok) => { if (ok) { setCopiedPath("__git"); setTimeout(() => setCopiedPath(""), 2200); } })}
                  className={`mt-4 w-full rounded-full border px-4 py-2.5 text-[12.5px] font-bold transition-all ${
                    copiedPath === "__git" ? "border-gold/60 bg-gold/15 text-gold" : "border-line text-fog hover:border-violet hover:text-lilac"
                  }`}
                >
                  {copiedPath === "__git" ? "✓ کپی شد" : "کپی دستورات"}
                </button>
                <pre dir="ltr" className="ltr mt-4 overflow-x-auto rounded-2xl border border-line-soft bg-ink/80 p-5 text-left font-mono text-[12px] leading-7 text-lilac/90">
                  {gitCommands}
                </pre>
                <p className="mt-3 text-[12px] leading-6 text-fog">
                  به‌جای <span className="ltr font-bold">USERNAME</span> نام کاربری گیت‌هاب خودت را بگذار.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── modal نمایش فایل ── */}
      {viewFile && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/85 p-4 backdrop-blur-sm" onClick={() => setViewFile(null)}>
          <div
            className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-violet/40 bg-surface-2 shadow-[0_0_90px_rgba(157,107,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "fadeUp .3s both" }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
              <span dir="ltr" className="truncate text-left font-mono text-[13px] font-bold text-lilac">{viewFile.path}</span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={copyViewed}
                  className={`rounded-full border px-5 py-2.5 text-[12.5px] font-extrabold transition-all ${
                    copiedPath === viewFile.path ? "border-gold/60 bg-gold/15 text-gold" : "border-violet/60 bg-violet text-ink hover:bg-lilac"
                  }`}
                >
                  {copiedPath === viewFile.path ? "✓ کپی شد" : "کپی کل محتوا"}
                </button>
                <button onClick={() => setViewFile(null)} className="grid h-10 w-10 place-items-center rounded-full border border-line text-fog transition-colors hover:border-magenta hover:text-magenta" aria-label="بستن">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4.5 w-4.5"><path d="m6 6 12 12M18 6 6 18" /></svg>
                </button>
              </div>
            </div>
            <pre dir="ltr" className="ltr min-h-0 flex-1 overflow-auto bg-ink/70 p-6 text-left font-mono text-[12px] leading-6.5 text-[#cfd8ff]">
              {viewFile.content}
            </pre>
            <div className="border-t border-line px-6 py-3.5 text-center text-[12px] leading-6 text-fog" dir="rtl">
              این فایل را در GitHub با مسیر <b className="ltr text-gold">{viewFile.path}</b> بساز و همین محتوا را داخلش پیست کن
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

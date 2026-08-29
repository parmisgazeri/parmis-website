import { useState } from "react";
import { Link } from "react-router-dom";
import { useCms, toFa } from "../cms/ContentContext";
import type { Course } from "../cms/defaultContent";
import { Reveal, SectionHead, IconArrow, IconCheck, IconClose, IconClock, IconSpark, IconAi, compressImage } from "../components/ui";

const LEVELS = ["همه", "مقدماتی", "متوسط", "پیشرفته"] as const;

/* ─────────────────────────────────────────────────────────────
   مودال ثبت‌نام و پرداخت کارت‌به‌کارت + آپلود رسید
   ───────────────────────────────────────────────────────────── */
function PaymentModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const { content, addInbox } = useCms();
  const card = content.settings.cardNumber || "—";
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [amount, setAmount] = useState(course.price.replace(/[^\d۰-۹]/g, ""));
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(card.replace(/-/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const onFile = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("فقط فایل تصویری (عکس رسید) مجاز است."); return; }
    setErr("");
    setBusy(true);
    try {
      const data = await compressImage(f, 900, 0.72);
      setReceipt(data);
      setReceiptName(f.name);
    } catch {
      setErr("خواندن تصویر ممکن نشد؛ فایل دیگری امتحان کنید.");
    } finally {
      setBusy(false);
    }
  };

  const submit = () => {
    if (!name.trim() || !contact.trim()) { setErr("نام و شماره تماس را کامل کنید."); return; }
    if (!receipt) { setErr("آپلود تصویر رسید پرداخت الزامی است."); return; }
    setErr("");
    addInbox({
      name: name.trim(),
      contact: contact.trim(),
      subject: `ثبت‌نام دوره: ${course.title}`,
      body: `مبلغ واریزی: ${amount || course.price}\n${note.trim() ? "توضیحات: " + note.trim() + "\n" : ""}رسید پرداخت به‌صورت تصویر ضمیمه شده است.`,
      kind: "payment",
      amount: amount || course.price,
      receipt,
    });
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink/85 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-xl rounded-3xl border border-violet/40 bg-surface shadow-[0_30px_90px_-20px_rgba(109,61,240,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-l from-gold via-violet to-transparent" />
        <button onClick={onClose} className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-line text-fog transition-colors hover:border-magenta hover:text-magenta" aria-label="بستن">
          <IconClose className="h-4.5 w-4.5" />
        </button>

        {!done ? (
          <div className="p-7 sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-[12px] font-extrabold text-gold">
              <IconSpark className="h-3.5 w-3.5" /> ثبت‌نام و پرداخت
            </span>
            <h3 className="mt-4 font-display text-[24px] leading-[1.5] text-white">{course.title}</h3>
            <p className="mt-1.5 text-[13px] text-fog">
              مبلغ دوره: <span className="font-display text-[17px] text-gold">{course.price}</span>
            </p>

            {/* card number */}
            <div className="mt-6 rounded-2xl border border-gold/35 bg-gradient-to-l from-gold/12 to-transparent p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] font-bold text-gold">شماره کارت (کارت‌به‌کارت)</span>
                <span className="text-[11.5px] font-semibold text-fog">{content.settings.cardHolder}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="ltr font-mono text-[21px] font-bold tracking-[0.14em] text-white sm:text-[23px]">{card}</span>
                <button
                  onClick={copyCard}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-extrabold transition-all duration-300 ${
                    copied ? "bg-[#27d17c] text-ink" : "bg-gold text-ink hover:brightness-110"
                  }`}
                >
                  {copied ? <IconCheck className="h-4 w-4" strokeWidth={2.6} /> : null}
                  {copied ? "کپی شد!" : "کپی شماره کارت"}
                </button>
              </div>
            </div>

            {/* form */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-lilac">نام و نام خانوادگی *</label>
                <input className="field text-[13.5px]" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: سارا محمدی" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-lilac">شماره تماس *</label>
                <input className="field ltr text-left text-[13.5px]" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="09xxxxxxxxx" />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-lilac">مبلغ واریزی (تومان)</label>
                <input className="field text-[13.5px]" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold text-lilac">توضیحات (اختیاری)</label>
                <input className="field text-[13.5px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder="کد تخفیف، سوال و..." />
              </div>
            </div>

            {/* receipt upload */}
            <label className={`mt-4 flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed p-5 transition-all duration-300 ${receipt ? "border-[#27d17c]/60 bg-[#27d17c]/8" : "border-line bg-ink/40 hover:border-gold/60"}`}>
              {receipt ? (
                <>
                  <img src={receipt} alt="پیش‌نمایش رسید" className="h-16 w-16 rounded-xl border border-line object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-white">{receiptName}</p>
                    <p className="mt-0.5 text-[11.5px] font-semibold text-[#27d17c]">✓ رسید آپلود شد — برای تغییر، دوباره کلیک کنید</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">
                    {busy ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                        <rect x="3" y="5" width="18" height="14" rx="2.4" /><path d="m4 7.5 8 6 8-6" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <p className="text-[14px] font-extrabold text-white">تصویر رسید پرداخت را آپلود کنید *</p>
                    <p className="mt-1 text-[12px] leading-5.5 text-fog">عکس رسید بانکی یا اسکرین‌شات انتقال — فرمت JPG/PNG</p>
                  </div>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
            </label>

            {err && <p className="mt-4 rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-[13px] font-bold text-magenta">⚠ {err}</p>}

            <button
              onClick={submit}
              disabled={busy}
              className="btn-shine mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-violet py-4 text-[15.5px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_40px_rgba(157,107,255,0.55)] disabled:opacity-50"
            >
              ارسال رسید و تکمیل ثبت‌نام
              <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
            </button>
            <p className="mt-3.5 text-center text-[11.5px] leading-5.5 text-fog">
              بعد از تأیید پرداخت، اطلاعات ورود به دوره برایتان پیامک می‌شود.
            </p>
          </div>
        ) : (
          <div className="p-10 text-center sm:p-14">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-[#27d17c]/50 bg-[#27d17c]/12 text-[#27d17c]">
              <IconCheck className="h-9 w-9" strokeWidth={2.6} />
            </span>
            <h3 className="mt-6 font-display text-[26px] text-white">رسید شما دریافت شد! 🎉</h3>
            <p className="mx-auto mt-3 max-w-sm text-[14px] leading-7.5 text-mist">
              ثبت‌نام شما برای دوره <b className="text-lilac">{course.title}</b> ثبت شد. بعد از بررسی رسید، در کمتر از ۲۴ ساعت با شماره <b className="text-white ltr">{contact}</b> تماس می‌گیریم.
            </p>
            <button onClick={onClose} className="mt-8 rounded-full bg-violet px-9 py-3.5 text-[14.5px] font-extrabold text-ink transition-all hover:bg-lilac">
              بازگشت به دوره‌ها
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── */
export default function Courses() {
  const { content } = useCms();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("همه");
  const [paying, setPaying] = useState<Course | null>(null);
  const featured = content.courses.find((c) => c.featured) ?? content.courses[0];
  const others = content.courses.filter((c) => c.id !== featured?.id);
  const list = level === "همه" ? others : others.filter((c) => c.level === level);

  const levelStyle = (l: string) =>
    l === "مقدماتی" ? "bg-violet/15 text-lilac" : l === "متوسط" ? "bg-gold/15 text-gold" : "bg-magenta/15 text-magenta";

  return (
    <div className="pt-[74px]">
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <SectionHead
          kicker="دوره‌ها و آموزش"
          title="مهارت‌هایی که خودم اجرا کرده‌ام، نه فقط خوانده‌ام"
          desc="هر دوره از تجربه واقعی پروژه‌ها ساخته شده؛ پروژه‌محور، کاربردی و بدون تئوری‌های اضافه. هدف این است که بعد از دوره، خودتان بتوانید اجرا کنید."
        />

        {/* payment strip — card number */}
        <Reveal delay={120}>
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-l from-gold/10 via-surface to-surface p-6">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gold/12 p-3 text-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6.5 w-6.5">
                    <rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 9.5h19M6 15.5h4M17.5 15.5h.01" />
                  </svg>
                </span>
                <div>
                  <p className="text-[14px] font-extrabold text-white">پرداخت امن کارت‌به‌کارت</p>
                  <p className="mt-1 text-[12.5px] text-fog">
                    شماره کارت: <span className="ltr font-mono font-bold tracking-wider text-gold">{content.settings.cardNumber}</span>
                    <span className="mx-2 text-line">|</span>{content.settings.cardHolder}
                  </p>
                </div>
              </div>
              <p className="max-w-xs text-[12px] leading-6 text-fog">
                بعد از واریز، روی دکمه ثبت‌نام هر دوره بزنید و <b className="text-gold">تصویر رسید</b> را آپلود کنید تا ثبت‌نامتان نهایی شود.
              </p>
            </div>
          </div>
        </Reveal>

        {/* featured course */}
        {featured && (
          <Reveal delay={150}>
            <article className="card-3d relative mt-12 overflow-hidden rounded-3xl border border-violet/40 bg-gradient-to-l from-surface via-surface-2 to-[#251238] p-8 lg:p-12">
              <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 right-10 h-52 w-52 rounded-full bg-magenta/10 blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-[12.5px] font-extrabold text-gold">
                      <IconSpark className="h-4 w-4" /> دوره ویژه و پیشنهادی
                    </span>
                    <span className={`rounded-full px-4 py-1.5 text-[12.5px] font-extrabold ${levelStyle(featured.level)}`}>{featured.level}</span>
                  </div>
                  <h2 className="mt-6 font-display text-[30px] leading-[1.45] text-white sm:text-4xl">{featured.title}</h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-8 text-mist">{featured.desc}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {featured.syllabus.map((sy) => (
                      <li key={sy} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-lilac/90">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-violet/20 text-violet">
                          <IconCheck className="h-3.5 w-3.5" strokeWidth={2.6} />
                        </span>
                        {sy}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-between rounded-2xl border border-line bg-ink/50 p-7 backdrop-blur">
                  <div className="space-y-4 text-[14px]">
                    <div className="flex items-center justify-between border-b border-line-soft pb-4">
                      <span className="flex items-center gap-2.5 text-fog"><IconClock className="h-4.5 w-4.5 text-violet" /> مدت دوره</span>
                      <span className="font-bold text-white">{featured.duration}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-line-soft pb-4">
                      <span className="flex items-center gap-2.5 text-fog"><IconAi className="h-4.5 w-4.5 text-violet" /> تعداد جلسات</span>
                      <span className="font-bold text-white">{featured.sessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-fog">سطح</span>
                      <span className={`rounded-full px-3.5 py-1 text-[12px] font-extrabold ${levelStyle(featured.level)}`}>{featured.level}</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="text-center font-display text-[28px] text-gold">{featured.price}</div>
                    <button
                      onClick={() => setPaying(featured)}
                      className="btn-shine mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-violet py-3.5 text-[15px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_36px_rgba(157,107,255,0.5)]"
                    >
                      ثبت‌نام و ارسال رسید پرداخت
                      <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
                    </button>
                    <p className="mt-3 text-center text-[12px] text-fog">ظرفیت هر دوره محدود است تا کیفیت پشتیبانی حفظ شود</p>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        )}

        {/* filter */}
        <Reveal delay={200}>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-5">
            <h2 className="font-display text-3xl text-white">سایر دوره‌ها</h2>
            <div className="flex flex-wrap gap-3">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-full border px-5 py-2.5 text-[13.5px] font-bold transition-all duration-300 ${
                    level === l ? "border-violet bg-violet text-ink" : "border-line bg-surface/60 text-mist hover:border-violet/60 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {list.map((c, i) => (
            <Reveal key={c.id} delay={(i % 2) * 120}>
              <article className="card-3d group flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-7 lg:p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className={`rounded-full px-4 py-1.5 text-[12px] font-extrabold ${levelStyle(c.level)}`}>{c.level}</span>
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-fog">
                    <IconClock className="h-4 w-4 text-violet" /> {c.duration} · {c.sessions}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[23px] leading-[1.5] text-white">{c.title}</h3>
                <p className="mt-3 text-[14px] leading-7.5 text-mist">{c.desc}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {c.syllabus.map((sy) => (
                    <li key={sy} className="flex items-center gap-2.5 text-[13px] font-semibold text-lilac/85">
                      <span className="h-1.5 w-1.5 rotate-45 bg-gold" /> {sy}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex items-center justify-between gap-3 border-t border-line-soft pt-6">
                  <span className="font-display text-[21px] text-gold">{c.price}</span>
                  <button
                    onClick={() => setPaying(c)}
                    className="inline-flex items-center gap-2 rounded-full border border-violet/50 px-5 py-2.5 text-[13.5px] font-bold text-lilac transition-all duration-300 hover:bg-violet hover:text-ink"
                  >
                    ثبت‌نام و ارسال رسید
                    <IconArrow className="h-4 w-4" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-line py-16 text-center text-fog">
            در این سطح دوره‌ای تعریف نشده — از پیشخوان مدیریت می‌توانید اضافه کنید.
          </div>
        )}

        <Reveal>
          <p className="mt-14 text-center text-[14px] text-fog">
            <span className="font-bold text-lilac">به‌زودی:</span> دوره‌های جدید در حال ضبط هستند.
            برای اطلاع از زمان انتشار، از صفحه <Link to="/contact" className="link-underline font-bold text-violet">تماس</Link> پیام بدهید.
            <span className="mx-1">{toFa(content.courses.length)}</span>دوره فعال.
          </p>
        </Reveal>
      </section>

      {paying && <PaymentModal course={paying} onClose={() => setPaying(null)} />}
    </div>
  );
}

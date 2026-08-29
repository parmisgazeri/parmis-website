import { useState } from "react";
import { useCms } from "../cms/ContentContext";
import {
  Reveal, SectionHead, IconArrow, IconChat, IconCheck, IconClock, IconMail, IconPhone, IconPin, IconSend,
} from "../components/ui";

export default function Contact() {
  const { content, addInbox } = useCms();
  const s = content.settings;
  const [form, setForm] = useState({ name: "", contact: "", subject: content.services[0]?.title ?? "", body: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.body.trim()) {
      setErr("نام، راه ارتباطی و متن پیام را حتماً پر کنید.");
      return;
    }
    addInbox({
      kind: "message",
      name: form.name.trim(),
      contact: form.contact.trim(),
      subject: form.subject,
      body: form.body.trim(),
    });
    setSent(true);
    setErr("");
  };

  const info = [
    { icon: IconPhone, label: "تماس تلفنی", value: s.phone, ltr: true, href: `tel:${s.phone}`, note: "سریع‌ترین راه ارتباط" },
    { icon: IconMail, label: "ایمیل", value: s.email, ltr: true, href: `mailto:${s.email}`, note: "برای ارسال فایل و جزئیات" },
    { icon: IconChat, label: "واتس‌اپ", value: "چت مستقیم", ltr: false, href: `https://wa.me/98${s.phone.slice(1)}`, note: "پاسخ معمولاً در چند دقیقه" },
    { icon: IconClock, label: "ساعات پاسخ‌گویی", value: s.workHours, ltr: false, href: "", note: s.location },
  ];

  return (
    <div className="pt-[74px]">
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <SectionHead
          kicker="تماس با من"
          title="یک پیام کافی است؛ بقیه‌اش با من"
          desc="سؤال، ایده یا پروژه — هر کدام که هست، بنویسید یا زنگ بزنید. حداکثر تا ۲۴ ساعت پاسخ می‌گیرید؛ معمولاً خیلی زودتر."
        />

        {/* info cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {info.map((it, i) => {
            const Icon = it.icon;
            const inner = (
              <>
                <div className="grid h-13 w-13 place-items-center rounded-xl border border-line bg-ink/60 p-3 text-violet transition-all duration-500 group-hover:border-violet group-hover:text-lilac">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <div className="text-[12.5px] font-bold text-fog">{it.label}</div>
                  <div className={`mt-1.5 break-all text-[15.5px] font-extrabold text-white ${it.ltr ? "ltr text-left tracking-wide" : ""}`}>{it.value}</div>
                  <div className="mt-1.5 text-[12px] text-fog">{it.note}</div>
                </div>
                {it.href && (
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-violet transition-transform duration-300 group-hover:-translate-x-1">
                    <IconArrow className="h-4 w-4" /> باز کردن
                  </span>
                )}
              </>
            );
            return (
              <Reveal key={it.label} delay={i * 100}>
                {it.href ? (
                  <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card-3d group block h-full rounded-2xl border border-line bg-surface/70 p-6.5">
                    {inner}
                  </a>
                ) : (
                  <div className="card-3d group h-full rounded-2xl border border-line bg-surface/70 p-6.5">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>

        {/* form + side */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              kicker="فرم پیام"
              title="پیامت را مستقیم بفرست"
              desc="پیام شما بدون واسطه به پیشخوان مدیریت من می‌رود و همان‌جا پاسخ می‌دهم. اگر عجله دارید، تماس تلفنی یا واتس‌اپ سریع‌تر است."
            />
            <Reveal delay={200}>
              <div className="mt-9 rounded-2xl border border-line bg-surface/70 p-6.5">
                <p className="font-display text-xl text-white">قبل از ارسال پیام، این را بخوانید:</p>
                <ul className="mt-4 space-y-3">
                  {["نوع خدمت موردنظر را انتخاب کنید تا دقیق‌تر پاسخ دهم", "اگر سایت دارید، آدرسش را بنویسید", "هدف‌تان از پروژه را در یک جمله بگویید"].map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[13.5px] leading-6.5 text-mist">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-violet/30 bg-violet/8 p-6">
                <IconPin className="h-8 w-8 shrink-0 text-violet" />
                <p className="text-[13.5px] font-semibold leading-6.5 text-lilac">{s.location}</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            {sent ? (
              <div className="toast-in flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-violet/40 bg-surface/80 p-12 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-violet/15 text-violet">
                  <IconCheck className="h-10 w-10" strokeWidth={2.2} />
                </span>
                <h3 className="mt-7 font-display text-3xl text-white">پیام شما رسید!</h3>
                <p className="mt-3 max-w-sm text-[14.5px] leading-7.5 text-mist">
                  ممنون {form.name} عزیز — پیام‌تان در پیشخوان ثبت شد و به‌زودی از طریق {form.contact} پاسخ می‌دهم.
                  برای کارهای فوری می‌توانید همین حالا تماس بگیرید: <span className="ltr font-bold text-lilac">{s.phone}</span>
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", contact: "", subject: content.services[0]?.title ?? "", body: "" }); }}
                  className="mt-8 rounded-full border border-line px-6 py-3 text-[13.5px] font-bold text-lilac transition-all hover:border-violet"
                >
                  ارسال پیام دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-3xl border border-line bg-surface/80 p-7 lg:p-9">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[13px] font-bold text-lilac">نام و نام خانوادگی *</label>
                    <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً: مریم احمدی" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-bold text-lilac">شماره تماس یا ایمیل *</label>
                    <input className="field" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="09xxxxxxxxx" dir="ltr" style={{ textAlign: "left" }} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-lilac">موضوع پیام</label>
                    <select className="field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                      {content.services.map((sv) => <option key={sv.id} value={sv.title}>{sv.title}</option>)}
                      <option value="مشاوره عمومی">مشاوره عمومی</option>
                      <option value="دوره‌ها و آموزش">دوره‌ها و آموزش</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-lilac">متن پیام *</label>
                    <textarea
                      className="field min-h-[150px] resize-y"
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      placeholder="درباره کسب‌وکارتان و چیزی که نیاز دارید بنویسید…"
                    />
                  </div>
                </div>
                {err && <p className="mt-4 rounded-lg border border-magenta/30 bg-magenta/10 px-4 py-3 text-[13px] font-bold text-magenta">{err}</p>}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="btn-shine inline-flex items-center justify-center gap-2.5 rounded-full bg-violet px-9 py-4 text-[15.5px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_40px_rgba(157,107,255,0.5)]"
                  >
                    <IconSend className="h-4.5 w-4.5" />
                    ارسال پیام
                  </button>
                  <a href={`https://wa.me/98${s.phone.slice(1)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 rounded-full border border-line px-7 py-4 text-[14.5px] font-bold text-lilac transition-all hover:border-violet hover:text-white">
                    <IconChat className="h-4.5 w-4.5" />
                    یا در واتس‌اپ بنویسید
                  </a>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}

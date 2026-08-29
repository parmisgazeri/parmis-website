import { useState } from "react";
import { useCms } from "../cms/ContentContext";
import { Reveal, SectionHead, SERVICE_ICONS, IconArrow, IconCheck, IconSend } from "../components/ui";

const BUDGETS = ["کمتر از ۲۰ میلیون تومان", "۲۰ تا ۵۰ میلیون تومان", "۵۰ تا ۱۵۰ میلیون تومان", "بیش از ۱۵۰ میلیون تومان", "توافقی / مشارکتی"];
const TIMELINES = ["فوری (کمتر از ۲ هفته)", "۲ تا ۶ هفته", "۱ تا ۳ ماه", "بلندمدت و مستمر"];

export default function Collaboration() {
  const { content, addInbox } = useCms();
  const [form, setForm] = useState({ name: "", contact: "", type: "", desc: "", budget: BUDGETS[4], timeline: TIMELINES[1] });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.desc.trim()) {
      setErr("نام، راه ارتباطی و توضیح پیشنهاد را حتماً پر کنید.");
      return;
    }
    addInbox({
      kind: "proposal",
      name: form.name.trim(),
      contact: form.contact.trim(),
      subject: `پیشنهاد همکاری — ${form.type || "نامشخص"} · ${form.budget} · ${form.timeline}`,
      body: form.desc.trim(),
    });
    setSent(true);
    setErr("");
  };

  return (
    <div className="pt-[74px]">
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <SectionHead
          kicker="پیشنهاد همکاری"
          title="بیایید چیزی بسازیم که بزرگ‌تر از یک پروژه باشد"
          desc="چه یک پروژه مشخص دارید، چه دنبال شریک فنی بلندمدت می‌گردید — فرم پیشنهاد را پر کنید تا بعد از یک جلسه آشنایی رایگان، پروپوزال شفاف دریافت کنید."
        />

        {/* collab types */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.collabTypes.map((ct, i) => {
            const Icon = SERVICE_ICONS[ct.icon] ?? SERVICE_ICONS.rocket;
            return (
              <Reveal key={ct.id} delay={i * 100}>
                <article className="card-3d group flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-7">
                  <div className="grid h-14 w-14 place-items-center rounded-xl border border-line bg-ink/60 text-violet transition-all duration-500 group-hover:rotate-6 group-hover:border-violet group-hover:text-lilac">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-[21px] text-white">{ct.title}</h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-7 text-mist">{ct.desc}</p>
                  <span className="mt-5 font-display text-3xl text-line transition-colors duration-500 group-hover:text-violet/60">
                    {["۰۱", "۰۲", "۰۳", "۰۴"][i] ?? ""}
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* steps */}
        <div className="mt-20 rounded-3xl border border-line bg-ink-2/70 p-8 lg:p-12">
          <Reveal>
            <h2 className="font-display text-3xl text-white">مسیر شروع همکاری</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.collabSteps.map((st, i) => (
              <Reveal key={st.id} delay={i * 110}>
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-violet/50 bg-violet/10 font-display text-xl text-lilac">
                      {["۱", "۲", "۳", "۴"][i]}
                    </span>
                    {i < content.collabSteps.length - 1 && (
                      <span className="hidden h-px flex-1 bg-gradient-to-l from-violet/50 to-transparent lg:block" />
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-[20px] text-white">{st.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-7 text-mist">{st.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* proposal form */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              kicker="فرم پیشنهاد"
              title="پیشنهادت را بفرست"
              desc="هرچه دقیق‌تر بنویسید، پروپوزال دقیق‌تری دریافت می‌کنید. پیشنهاد شما مستقیم به پیشخوان مدیریت من می‌رود و حداکثر تا ۲۴ ساعت پاسخ می‌گیرید."
            />
            <Reveal delay={220}>
              <div className="mt-8 space-y-3.5">
                {["جلسه آشنایی اولیه کاملاً رایگان است", "پروپوزال با زمان‌بندی و هزینه شفاف", "گزارش پیشرفت در هر مرحله همکاری"].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-[14px] font-semibold text-mist">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet/15 text-violet">
                      <IconCheck className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                    {t}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            {sent ? (
              <div className="toast-in flex h-full flex-col items-center justify-center rounded-3xl border border-violet/40 bg-surface/80 p-12 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-violet/15 text-violet">
                  <IconCheck className="h-10 w-10" strokeWidth={2.2} />
                </span>
                <h3 className="mt-7 font-display text-3xl text-white">پیشنهاد شما ثبت شد!</h3>
                <p className="mt-3 max-w-sm text-[14.5px] leading-7.5 text-mist">
                  ممنون {form.name} عزیز — پیشنهاد شما به پیشخوان مدیریت رفت. حداکثر تا ۲۴ ساعت از طریق {form.contact} با شما تماس می‌گیرم.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", contact: "", type: "", desc: "", budget: BUDGETS[4], timeline: TIMELINES[1] }); }}
                  className="mt-8 rounded-full border border-line px-6 py-3 text-[13.5px] font-bold text-lilac transition-all hover:border-violet"
                >
                  ارسال پیشنهاد دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-3xl border border-line bg-surface/80 p-7 lg:p-9">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[13px] font-bold text-lilac">نام و نام خانوادگی *</label>
                    <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً: علی رضایی" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-bold text-lilac">شماره تماس یا ایمیل *</label>
                    <input className="field" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="09xxxxxxxxx" dir="ltr" style={{ textAlign: "left" }} />
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-bold text-lilac">نوع همکاری</label>
                    <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="">انتخاب کنید…</option>
                      {content.collabTypes.map((ct) => (
                        <option key={ct.id} value={ct.title}>{ct.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[13px] font-bold text-lilac">بودجه حدودی</label>
                    <select className="field" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                      {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-lilac">زمان‌بندی مدنظر</label>
                    <select className="field" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
                      {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[13px] font-bold text-lilac">توضیح ایده یا نیاز *</label>
                    <textarea
                      className="field min-h-[130px] resize-y"
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      placeholder="کسب‌وکارتان چیست، الان کجای مسیر هستید و چه نتیجه‌ای می‌خواهید؟"
                    />
                  </div>
                </div>
                {err && <p className="mt-4 rounded-lg border border-magenta/30 bg-magenta/10 px-4 py-3 text-[13px] font-bold text-magenta">{err}</p>}
                <button
                  type="submit"
                  className="btn-shine mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-violet py-4 text-[15.5px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_40px_rgba(157,107,255,0.5)] sm:w-auto sm:px-10"
                >
                  <IconSend className="h-4.5 w-4.5" />
                  ارسال پیشنهاد همکاری
                  <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}

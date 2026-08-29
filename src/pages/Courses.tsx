import { useState } from "react";
import { Link } from "react-router-dom";
import { useCms, toFa } from "../cms/ContentContext";
import { Reveal, SectionHead, IconArrow, IconCheck, IconClock, IconSpark, IconAi } from "../components/ui";

const LEVELS = ["همه", "مقدماتی", "متوسط", "پیشرفته"] as const;

export default function Courses() {
  const { content } = useCms();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("همه");
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

        {/* featured course */}
        {featured && (
          <Reveal delay={150}>
            <article className="card-3d relative mt-14 overflow-hidden rounded-3xl border border-violet/40 bg-gradient-to-l from-surface via-surface-2 to-[#251238] p-8 lg:p-12">
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
                    <Link
                      to="/contact"
                      className="btn-shine mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-violet py-3.5 text-[15px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_36px_rgba(157,107,255,0.5)]"
                    >
                      ثبت‌نام در دوره
                      <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
                    </Link>
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
                <div className="mt-7 flex items-center justify-between border-t border-line-soft pt-6">
                  <span className="font-display text-[21px] text-gold">{c.price}</span>
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-violet/50 px-5 py-2.5 text-[13.5px] font-bold text-lilac transition-all duration-300 hover:bg-violet hover:text-ink">
                    ثبت‌نام و مشاوره
                    <IconArrow className="h-4 w-4" />
                  </Link>
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
    </div>
  );
}

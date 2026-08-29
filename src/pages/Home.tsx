import { Link } from "react-router-dom";
import { useCms, toFa } from "../cms/ContentContext";
import HeroScene from "../components/three/HeroScene";
import {
  Counter, Marquee, ProjectMedia, Reveal, ScrambleText, SectionHead,
  SERVICE_ICONS, IconArrow, IconArrowUpLeft, IconQuote, IconSpark, IconCheck,
} from "../components/ui";

const SPANS: Record<string, string> = {
  wide: "lg:col-span-4",
  narrow: "lg:col-span-2",
  full: "lg:col-span-6",
};

export default function Home() {
  const { content } = useCms();
  const s = content.settings;

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 lg:left-0 lg:right-auto lg:w-[52%] lg:opacity-100 opacity-25">
          <HeroScene />
          <div className="absolute inset-0 bg-gradient-to-l from-ink via-transparent to-transparent max-lg:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-10 pt-36 lg:px-8">
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 px-4 py-2 text-[12.5px] font-bold text-lilac backdrop-blur">
                <span className="pulse-dot h-2 w-2 rounded-full bg-violet" />
                {s.heroBadge}
                <span className="text-gold">✦</span>
                <span className="text-fog font-medium">طراحی · توسعه · اتوماسیون</span>
              </span>
            </Reveal>

            <h1 className="mt-7 font-display text-[44px] leading-[1.28] text-white sm:text-6xl lg:text-[68px] lg:leading-[1.22]">
              {s.heroTitle}
              <span className="text-glow block text-violet">
                <ScrambleText text={s.heroHighlight} />
              </span>
              <span className="block">
                تبدیل کن<span className="caret text-gold">_</span>
              </span>
            </h1>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-[15.5px] leading-8.5 text-mist">{s.heroDesc}</p>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="btn-shine inline-flex items-center gap-2.5 rounded-full bg-violet px-7 py-3.5 text-[15px] font-extrabold text-ink transition-all duration-300 hover:bg-lilac hover:shadow-[0_0_44px_rgba(157,107,255,0.55)]"
                >
                  شروع پروژه
                  <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
                </Link>
                <Link
                  to="/portfolio"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-7 py-3.5 text-[15px] font-bold text-lilac backdrop-blur transition-all duration-300 hover:border-violet hover:text-white"
                >
                  دیدن نمونه‌کارها
                  <IconArrowUpLeft className="h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={420}>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] font-semibold text-fog">
                {["وردپرس و ووکامرس", "قالب و افزونه اختصاصی", "بیزینس پلن", "اتوماسیون با AI"].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <span className="h-1 w-1 rotate-45 bg-gold" /> {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* stats strip */}
        <div className="relative border-t border-line-soft bg-ink/60 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-x-reverse divide-line-soft lg:grid-cols-4">
            {content.stats.map((st, i) => (
              <Reveal key={st.id} delay={i * 90} className="px-6 py-7 lg:px-8">
                <div className="font-display text-[34px] leading-none text-white lg:text-[40px]">
                  <Counter value={st.value} suffix={st.suffix} />
                </div>
                <div className="mt-2 text-[13px] font-medium text-fog">{st.label}</div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* services marquee */}
        <div className="relative border-y border-line-soft bg-surface/50 py-4">
          <Marquee speed={30}>
            {[...content.services.map((x) => x.title), ...content.services.map((x) => x.title)].map((t, i) => (
              <span key={i} className="mx-6 flex items-center gap-6 whitespace-nowrap">
                <span className="font-display text-xl text-lilac/85">{t}</span>
                <IconSpark className="h-4 w-4 text-violet/70" />
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ============ SERVICES — asymmetric bento ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="خدمات استودیو"
            title="هر آنچه یک کسب‌وکار دیجیتال لازم دارد"
            desc="از ساخت زیرساخت سایت تا طراحی مدل کسب‌وکار و اتوماسیون فرآیندها — همه در یک مسیر منسجم، نه سرویس‌های پراکنده."
          />
          <Reveal delay={200}>
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14px] font-bold text-lilac transition-all hover:border-violet hover:bg-surface">
              دریافت مشاوره رایگان
              <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {content.services.map((sv, i) => {
            const Icon = SERVICE_ICONS[sv.icon] ?? SERVICE_ICONS.web;
            const isFull = sv.span === "full";
            return (
              <Reveal
                key={sv.id}
                delay={(i % 3) * 110}
                className={`${SPANS[sv.span] ?? "lg:col-span-3"} ${isFull ? "lg:col-span-6" : ""}`}
              >
                <article
                  className={`card-3d group relative h-full overflow-hidden rounded-2xl border border-line bg-surface/70 p-7 lg:p-8 ${
                    isFull ? "bg-gradient-to-l from-surface via-surface-2 to-[#241238]" : ""
                  }`}
                >
                  <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-violet/10 blur-2xl transition-all duration-500 group-hover:bg-violet/25" />
                  <div className={`flex items-start justify-between gap-4 ${isFull ? "lg:flex-row lg:items-center" : ""}`}>
                    <div className={`grid place-items-center rounded-xl border border-line bg-ink/60 text-violet transition-all duration-500 group-hover:rotate-6 group-hover:border-violet group-hover:text-lilac ${isFull ? "h-16 w-16" : "h-14 w-14"}`}>
                      <Icon className={isFull ? "h-8 w-8" : "h-7 w-7"} />
                    </div>
                    <span className="font-display text-3xl leading-none text-line transition-colors duration-500 group-hover:text-violet/60">
                      {toFa(String(i + 1).padStart(2, "0"))}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-[26px] leading-snug text-white">{sv.title}</h3>
                  <p className={`mt-3 text-[14.5px] leading-7.5 text-mist ${isFull ? "lg:max-w-3xl" : ""}`}>{sv.desc}</p>

                  <ul className={`mt-6 flex flex-wrap gap-x-7 gap-y-2.5 ${isFull ? "" : ""}`}>
                    {sv.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[13px] font-semibold text-lilac/85">
                        <IconCheck className="h-3.5 w-3.5 text-gold" strokeWidth={2.6} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isFull && (
                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line-soft pt-7">
                      <Link to="/contact" className="btn-shine inline-flex items-center gap-2 rounded-full bg-violet px-6 py-3 text-[14px] font-extrabold text-ink transition-all hover:bg-lilac">
                        درخواست اتوماسیون
                        <IconArrow className="h-4 w-4" strokeWidth={2.3} />
                      </Link>
                      <span className="text-[13px] text-fog">اولین جلسه تحلیل فرآیندها رایگان است</span>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ PROCESS — sticky two-column ============ */}
      <section className="relative border-y border-line-soft bg-ink-2/70 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1fr_1.25fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              kicker="رویکرد من"
              title="سایت محصول نهایی نیست؛ شروعِ سیستم است"
              desc="بسیاری از کسب‌وکارها یک وب‌سایت دارند، اما یک «سیستم دیجیتال» ندارند. سایت ساخته شده، اما مشتری جذب نمی‌شود؛ فروش دستی است؛ پیگیری فراموش می‌شود. من این مسیر را کامل می‌سازم:"
            />
            <Reveal delay={250}>
              <div className="mt-9 rounded-2xl border border-line bg-surface/70 p-6">
                <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-lilac">
                  {content.steps.map((st, i) => (
                    <span key={st.id} className="flex items-center gap-2">
                      <span className="rounded-lg border border-line bg-ink/60 px-3 py-1.5 transition-colors hover:border-violet">{st.title}</span>
                      {i < content.steps.length - 1 && <IconArrow className="h-3.5 w-3.5 text-violet" />}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={330}>
              <Link to="/about" className="group mt-8 inline-flex items-center gap-2.5 text-[14.5px] font-bold text-violet">
                بیشتر درباره رویکرد من بدانید
                <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
              </Link>
            </Reveal>
          </div>

          <div className="relative">
            <div className="absolute bottom-4 right-[27px] top-4 w-px bg-gradient-to-b from-violet/60 via-line to-transparent" />
            <div className="space-y-6">
              {content.steps.map((st, i) => (
                <Reveal key={st.id} delay={(i % 4) * 90}>
                  <div className="group relative flex gap-6 rounded-2xl border border-line bg-surface/60 p-6 transition-all duration-500 hover:translate-x-[-6px] hover:border-violet/60 hover:bg-surface">
                    <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-line bg-ink font-display text-2xl text-violet transition-all duration-500 group-hover:border-violet group-hover:bg-violet group-hover:text-ink">
                      {toFa(String(i + 1).padStart(2, "0"))}
                    </div>
                    <div>
                      <h3 className="font-display text-[22px] text-white">{st.title}</h3>
                      <p className="mt-1.5 text-[14px] leading-7 text-mist">{st.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TECH MARQUEE ============ */}
      <section className="py-14">
        <div className="mx-auto mb-8 max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="text-center text-[13px] font-bold tracking-[0.3em] text-fog">ابزارها و تکنولوژی‌هایی که با آن‌ها می‌سازم</p>
          </Reveal>
        </div>
        <div className="border-y border-line-soft bg-surface/40 py-5">
          <Marquee speed={38}>
            {content.techStack.map((t, i) => (
              <span key={i} className="mx-4 flex items-center gap-4 whitespace-nowrap">
                <span className="rounded-full border border-line bg-ink/50 px-5 py-2 text-[13.5px] font-bold text-lilac/90 transition-colors hover:border-violet">{t}</span>
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker="نمونه‌کارها" title="پروژه‌هایی که سیستم شدند" />
          <Reveal delay={180}>
            <Link to="/portfolio" className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14px] font-bold text-lilac transition-all hover:border-violet hover:bg-surface">
              همه پروژه‌ها
              <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.projects.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 120}>
              <Link to="/portfolio" className="card-3d group block h-full overflow-hidden rounded-2xl border border-line bg-surface/70">
                <div className="overflow-hidden">
                  <div className="transition-transform duration-700 group-hover:scale-[1.05]">
                    <ProjectMedia project={p} />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-[20px] leading-snug text-white">{p.title}</h3>
                    <IconArrowUpLeft className="h-5 w-5 shrink-0 text-fog transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-violet" />
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-6.5 text-mist">{p.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gold/25 bg-gold/10 px-3 py-1.5 text-[12px] font-bold text-gold">
                    <IconSpark className="h-3.5 w-3.5" />
                    {p.result}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ COURSES PREVIEW ============ */}
      <section className="border-t border-line-soft bg-ink-2/60 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              kicker="آموزش"
              title="خودت هم می‌توانی بسازی"
              desc="تجربه‌های واقعی مسیر طراحی سایت، کسب‌وکار دیجیتال و اتوماسیون — به شکل دوره‌های کاربردی و پروژه‌محور."
            />
            <Reveal delay={180}>
              <Link to="/courses" className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[14px] font-bold text-lilac transition-all hover:border-violet hover:bg-surface">
                همه دوره‌ها
                <IconArrow className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {content.courses.slice(0, 3).map((c, i) => (
              <Reveal key={c.id} delay={i * 120}>
                <Link to="/courses" className="card-3d group flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-7">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-extrabold ${
                      c.level === "مقدماتی" ? "bg-violet/15 text-lilac" : c.level === "متوسط" ? "bg-gold/15 text-gold" : "bg-magenta/15 text-magenta"
                    }`}>
                      {c.level}
                    </span>
                    <span className="text-[12.5px] font-semibold text-fog">{c.duration} · {c.sessions}</span>
                  </div>
                  <h3 className="mt-5 font-display text-[21px] leading-relaxed text-white">{c.title}</h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-6.5 text-mist">{c.desc}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-line-soft pt-5">
                    <span className="font-display text-lg text-gold">{c.price}</span>
                    <span className="text-[13px] font-bold text-violet transition-transform duration-300 group-hover:-translate-x-1">جزئیات دوره ←</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHead center kicker="نظر مشتری‌ها" title="آن‌ها سیستم‌شان را دیده‌اند" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {content.testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 130}>
              <figure className="card-3d relative flex h-full flex-col rounded-2xl border border-line bg-surface/70 p-7">
                <IconQuote className="h-9 w-9 text-violet/70" />
                <blockquote className="mt-5 flex-1 text-[14.5px] leading-8 text-mist">{t.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-line-soft pt-5">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-violet/40 bg-violet/15 font-display text-xl text-lilac">
                    {t.name.replace("دکتر ", "").charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-extrabold text-white">{t.name}</span>
                    <span className="block text-[12.5px] text-fog">{t.role} · {t.project}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="ring-conic spin-slow h-[560px] w-[560px] rounded-full opacity-25 blur-[2px]" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="spin-slower h-[720px] w-[720px] rounded-full border border-dashed border-violet/20" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 text-[12.5px] font-bold text-lilac backdrop-blur">
              <IconSpark className="h-4 w-4 text-gold" />
              آماده‌ای شروع کنیم؟
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-7 font-display text-[42px] leading-[1.3] text-white sm:text-6xl">
              فقط یک سایت نمی‌خواهی؛
              <span className="text-glow block text-violet">یک سیستم برای رشد می‌خواهی.</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-8 text-mist">
              ایده‌ات را بگو تا با هم بررسی کنیم چطور به یک کسب‌وکار دیجیتال واقعی تبدیل می‌شود — از بیزینس پلن تا سایت و اتوماسیون.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="btn-shine inline-flex items-center gap-2.5 rounded-full bg-violet px-8 py-4 text-[15.5px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_50px_rgba(157,107,255,0.6)]">
                ایده‌ام را به سیستم تبدیل کن
                <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
              </Link>
              <a href={`tel:${s.phone}`} className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-7 py-4 text-[15px] font-bold text-lilac backdrop-blur transition-all hover:border-violet hover:text-white">
                <span className="ltr tracking-widest">{s.phone}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

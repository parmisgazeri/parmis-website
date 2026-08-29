import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCms, toFa } from "../cms/ContentContext";
import { ProjectMedia, Reveal, SectionHead, IconArrow, IconSpark, IconClock } from "../components/ui";

export default function Portfolio() {
  const { content } = useCms();
  const cats = useMemo(() => ["همه", ...Array.from(new Set(content.projects.map((p) => p.category)))], [content.projects]);
  const [active, setActive] = useState("همه");
  const list = active === "همه" ? content.projects : content.projects.filter((p) => p.category === active);

  return (
    <div className="pt-[74px]">
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            kicker="نمونه‌کارها"
            title="پروژه‌هایی که ساخته شدند تا کار کنند"
            desc="هر پروژه اینجا فقط یک «سایت» نیست؛ یک سیستم است با هدف مشخص، عدد نتیجه و مسیری که طی شده. دسته‌بندی موردنظرتان را انتخاب کنید."
          />
          <Reveal delay={200}>
            <div className="rounded-2xl border border-line bg-surface/70 px-7 py-5 text-center">
              <div className="font-display text-4xl text-violet">{toFa(content.projects.length)}<span className="text-gold">+</span></div>
              <div className="mt-1 text-[12.5px] font-bold text-fog">پروژه در این صفحه</div>
            </div>
          </Reveal>
        </div>

        {/* filter chips */}
        <Reveal delay={150}>
          <div className="mt-12 flex flex-wrap gap-3">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-5 py-2.5 text-[13.5px] font-bold transition-all duration-300 ${
                  active === c
                    ? "border-violet bg-violet text-ink shadow-[0_0_24px_rgba(157,107,255,0.4)]"
                    : "border-line bg-surface/60 text-mist hover:border-violet/60 hover:text-white"
                }`}
              >
                {c}
                <span className={`mr-2 text-[11px] ${active === c ? "text-ink/70" : "text-fog"}`}>
                  {toFa(c === "همه" ? content.projects.length : content.projects.filter((p) => p.category === c).length)}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* grid */}
        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 110}>
              <article className="card-3d group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70">
                <div className="overflow-hidden">
                  <div className="transition-transform duration-700 group-hover:scale-[1.06]">
                    <ProjectMedia project={p} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[21px] leading-snug text-white">{p.title}</h3>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-ink/60 px-2.5 py-1 text-[11.5px] font-bold text-fog">
                      <IconClock className="h-3.5 w-3.5" /> {p.year}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-[13.5px] leading-7 text-mist">{p.desc}</p>
                  <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-gold/25 bg-gold/10 px-3.5 py-2 text-[12.5px] font-bold text-gold">
                    <IconSpark className="h-4 w-4" />
                    {p.result}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-line-soft pt-5">
                    {p.tech.map((t) => (
                      <span key={t} className="rounded-full bg-violet/10 px-3 py-1 text-[11.5px] font-bold text-lilac/90">{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-line py-20 text-center text-fog">
            پروژه‌ای در این دسته‌بندی ثبت نشده است.
          </div>
        )}

        {/* CTA */}
        <Reveal>
          <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-3xl border border-line bg-gradient-to-l from-surface via-surface-2 to-[#241238] p-9 sm:flex-row lg:p-12">
            <div>
              <h3 className="font-display text-3xl text-white">پروژه بعدی می‌تواند مال شما باشد</h3>
              <p className="mt-2 text-[14.5px] text-mist">ایده‌تان را بگویید تا بگویم چطور به یک سیستم قابل رشد تبدیل می‌شود.</p>
            </div>
            <Link to="/contact" className="btn-shine inline-flex shrink-0 items-center gap-2.5 rounded-full bg-violet px-8 py-4 text-[15px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_40px_rgba(157,107,255,0.55)]">
              شروع پروژه جدید
              <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

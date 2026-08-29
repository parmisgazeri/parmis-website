import { Link } from "react-router-dom";
import { useCms } from "../cms/ContentContext";
import { Reveal, SectionHead, IconArrow, IconCheck, IconSpark, IconQuote, SERVICE_ICONS } from "../components/ui";

const PIPELINE = ["استراتژی", "برند", "وب‌سایت", "جذب مخاطب", "فروش", "اتوماسیون", "تحلیل", "رشد"];

const QUESTIONS = [
  "مشتری شما چه کسی است؟",
  "چه مشکلی دارد؟",
  "چرا باید از شما خرید کند؟",
  "چطور شما را پیدا می‌کند؟",
  "چطور به مشتری تبدیل می‌شود؟",
  "بعد از خرید چه اتفاقی می‌افتد؟",
  "کدام بخش‌ها را می‌توان با تکنولوژی و AI هوشمند‌تر کرد؟",
];

export default function About() {
  const { content } = useCms();

  return (
    <div className="pt-[74px]">
      {/* intro */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.25fr_1fr] lg:px-8 lg:py-28">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 px-4 py-2 text-[12.5px] font-bold text-lilac">
                <span className="pulse-dot h-2 w-2 rounded-full bg-violet" />
                درباره من
              </span>
            </Reveal>
            <h1 className="mt-6 font-display text-[40px] leading-[1.3] text-white sm:text-5xl lg:text-[54px]">
              از ایده تا یک
              <span className="text-glow block text-violet">کسب‌وکار دیجیتال واقعی</span>
            </h1>
            <Reveal delay={180}>
              <p className="mt-6 text-[15.5px] leading-8.5 text-mist">
                من <strong className="text-white">پارمیس</strong> هستم؛ متخصص طراحی و توسعه وب، اتوماسیون هوشمند و طراحی سیستم‌های دیجیتال برای کسب‌وکارها.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-4 text-[15.5px] leading-8.5 text-mist">
                مسیر حرفه‌ای من از حوزه <strong className="text-lilac">روان‌شناسی و مشاوره</strong> شروع شد؛ جایی که با رفتار انسان، نیازهای واقعی مشتری و فرآیند تصمیم‌گیری آشنا شدم. در ادامه، علاقه‌ام به تکنولوژی و کسب‌وکار باعث شد وارد دنیای طراحی سایت، وردپرس، فروش آنلاین و ابزارهای هوش مصنوعی شوم.
              </p>
            </Reveal>
            <Reveal delay={340}>
              <div className="mt-8 rounded-2xl border-r-4 border-violet bg-surface/80 p-6">
                <p className="text-[16px] font-bold leading-8 text-white">
                  امروز تمرکز من روی یک نقطه مشترک بین این حوزه‌هاست:
                  <span className="mt-2 block text-lilac">ساخت کسب‌وکارهایی که هم برای انسان درست طراحی شده‌اند و هم برای رشد، فروش و مقیاس‌پذیری.</span>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative mx-auto max-w-[400px]">
              <div className="absolute -inset-5 rounded-[2rem] border border-dashed border-violet/30 spin-slower" style={{ borderRadius: "2.5rem" }} />
              <img
                src="https://image.qwenlm.ai/generated-images/721aeec5-2aa8-4213-9ba9-6427811fe193/_result.png"
                alt="مجسمه دیجیتال برند پارمیس"
                className="relative w-full rounded-[2rem] border border-line object-cover shadow-[0_30px_80px_-20px_rgba(109,61,240,0.45)]"
                loading="eager"
              />
              <div className="float-y absolute -right-5 top-10 rounded-xl border border-line bg-ink/90 px-4 py-3 backdrop-blur">
                <span className="block text-[11px] font-bold text-fog">شروع مسیر</span>
                <span className="font-display text-lg text-lilac">روان‌شناسی و مشاوره</span>
              </div>
              <div className="float-y absolute -left-5 bottom-14 rounded-xl border border-line bg-ink/90 px-4 py-3 backdrop-blur" style={{ animationDelay: "-3s" }}>
                <span className="block text-[11px] font-bold text-fog">تمرکز امروز</span>
                <span className="font-display text-lg text-violet">سیستم‌های دیجیتال</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* what I do */}
      <section className="border-y border-line-soft bg-ink-2/70 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHead
            kicker="مسئله اصلی"
            title="سایت دارید، یا «سیستم دیجیتال»؟"
            desc="بسیاری از کسب‌وکارها یک وب‌سایت دارند، اما یک سیستم دیجیتال ندارند. اگر این نشانه‌ها برایتان آشناست، دقیقاً جای درستی آمده‌اید:"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              "سایت ساخته شده، اما مشتری به‌درستی جذب نمی‌شود",
              "فرآیند فروش کاملاً دستی است",
              "پیگیری مشتری‌ها فراموش می‌شود",
              "کارهای تکراری توسط نیروی انسانی انجام می‌شود",
              "نمی‌دانید چطور این سیستم را توسعه دهید",
            ].map((q, i) => (
              <Reveal key={q} delay={i * 90}>
                <div className="card-3d flex h-full items-start gap-3 rounded-xl border border-line bg-surface/70 p-5">
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-magenta/15 text-[12px] font-black text-magenta">✕</span>
                  <p className="text-[13.5px] font-semibold leading-6.5 text-mist">{q}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-10 text-center font-display text-2xl text-white sm:text-3xl">
              من کمک می‌کنم این بخش‌ها <span className="text-violet">در کنار هم</span> قرار بگیرند.
            </p>
          </Reveal>
        </div>
      </section>

      {/* services from about text */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:py-24">
        <SectionHead kicker="خدمات من" title="دقیقاً چه کاری انجام می‌دهم؟" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {content.services.slice(0, 4).map((sv, i) => {
            const Icon = SERVICE_ICONS[sv.icon] ?? SERVICE_ICONS.web;
            return (
              <Reveal key={sv.id} delay={i * 100}>
                <article className="card-3d group flex h-full gap-6 rounded-2xl border border-line bg-surface/70 p-7">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-line bg-ink/60 text-violet transition-all duration-500 group-hover:border-violet group-hover:text-lilac">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-[22px] text-white">{sv.title}</h3>
                    <p className="mt-2.5 text-[14px] leading-7.5 text-mist">{sv.desc}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* why different — pipeline + questions */}
      <section className="border-y border-line-soft bg-ink-2/70 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <SectionHead
              kicker="تفاوت رویکرد"
              title="چرا رویکرد من متفاوت است؟"
              desc="من طراحی سایت را یک محصول نهایی نمی‌بینم. برای من، سایت باید بخشی از یک اکوسیستم بزرگ‌تر باشد — به همین دلیل قبل از اینکه درباره رنگ، فونت یا ظاهر سایت صحبت کنیم، باید این سؤال‌ها جواب داشته باشند:"
            />
            <div className="mt-9 space-y-3">
              {QUESTIONS.map((q, i) => (
                <Reveal key={q} delay={i * 70}>
                  <div className="flex items-center gap-3.5 rounded-xl border border-line bg-surface/60 px-5 py-3.5 transition-all duration-300 hover:translate-x-[-5px] hover:border-violet/60">
                    <span className="font-display text-lg text-violet/70">{["۱","۲","۳","۴","۵","۶","۷"][i]}</span>
                    <span className="text-[14.5px] font-semibold text-mist">{q}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="rounded-3xl border border-line bg-gradient-to-b from-surface to-surface-2 p-8 lg:p-10">
                <p className="font-display text-2xl leading-relaxed text-white">
                  اکوسیستمی که من می‌سازم:
                </p>
                <div className="mt-7 space-y-0">
                  {PIPELINE.map((p, i) => (
                    <div key={p} className="group flex items-center gap-5">
                      <div className="flex flex-col items-center">
                        <span className={`grid h-11 w-11 place-items-center rounded-full border font-display text-lg transition-all duration-300 ${i === PIPELINE.length - 1 ? "border-gold bg-gold/15 text-gold" : "border-violet/50 bg-violet/10 text-lilac group-hover:border-violet group-hover:bg-violet group-hover:text-ink"}`}>
                          {["۱","۲","۳","۴","۵","۶","۷","۸"][i]}
                        </span>
                        {i < PIPELINE.length - 1 && <span className="h-7 w-px bg-gradient-to-b from-violet/50 to-violet/10" />}
                      </div>
                      <span className="font-display text-[21px] text-white transition-colors group-hover:text-violet">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-9 border-t border-line-soft pt-7">
                  <p className="text-[15px] font-bold leading-8 text-white">
                    هدف من ساختن سیستمی است که فقط «زیبا» نباشد؛
                    <span className="block text-lilac">بلکه کار کند، بفروشد و قابلیت رشد داشته باشد.</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* experience */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHead
              kicker="تجربه ساختن"
              title="بین «دانستن» و «ساختن» فاصله زیادی است"
              desc="در سال‌های اخیر روی پروژه‌های مختلف طراحی و توسعه وب کار کرده‌ام و در کنار آن، محصولات و ایده‌های دیجیتال خودم را هم ساخته‌ام."
            />
            <Reveal delay={200}>
              <p className="mt-6 text-[15px] leading-8.5 text-mist">
                این مسیر به من یاد داد که راهکارها باید تا حد ممکن <strong className="text-lilac">عملی، قابل اجرا و متناسب با منابع واقعی هر کسب‌وکار</strong> باشند — نه صرفاً مجموعه‌ای از توصیه‌های تئوری.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap gap-3">
                {["هوش مصنوعی", "برنامه‌نویسی", "اتوماسیون", "علوم شناختی", "طراحی محصول"].map((t) => (
                  <span key={t} className="flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-[13px] font-bold text-lilac transition-colors hover:border-violet">
                    <IconSpark className="h-3.5 w-3.5 text-gold" /> {t}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={340}>
              <p className="mt-7 text-[14px] leading-7 text-fog">
                من همچنان در حال یادگیری و توسعه مهارت‌هایم هستم؛ چون معتقدم دنیای دیجیتال جایی برای متوقف شدن ندارد.
              </p>
            </Reveal>
          </div>

          <div>
            <SectionHead
              kicker="نگاه به آینده"
              title="آینده متعلق به سیستم‌هاست"
              desc="آینده کسب‌وکارهای دیجیتال فقط متعلق به کسانی نیست که یک سایت خوب دارند."
            />
            <Reveal delay={180}>
              <div className="mt-8 rounded-3xl border border-line bg-surface/70 p-8">
                <IconQuote className="h-9 w-9 text-violet/70" />
                <p className="mt-5 text-[15.5px] font-semibold leading-9 text-white">
                  کسب‌وکارهای موفق آینده، کسب‌وکارهایی هستند که بتوانند از
                  <span className="mx-1.5 rounded-lg bg-violet/15 px-2 py-0.5 text-lilac">داده</span>،
                  <span className="mx-1.5 rounded-lg bg-magenta/15 px-2 py-0.5 text-magenta">اتوماسیون</span> و
                  <span className="mx-1.5 rounded-lg bg-gold/15 px-2 py-0.5 text-gold">هوش مصنوعی</span>
                  برای بهتر شناختن مشتری، سریع‌تر شدن فرآیندها و ایجاد تجربه بهتر استفاده کنند.
                </p>
                <p className="mt-5 text-[14px] leading-7.5 text-mist">
                  من می‌خواهم در این مسیر کنار کسب‌وکارها باشم؛ از شکل‌گیری ایده و طراحی مدل کسب‌وکار، تا ساخت زیرساخت دیجیتال، اتوماسیون فرآیندها و ایجاد مسیر رشد.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="relative overflow-hidden border-t border-line-soft bg-ink-2/70 py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[640px] -translate-x-1/2 bg-violet/10 blur-[110px]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-display text-[34px] leading-[1.35] text-white sm:text-5xl">
              اگر فقط به یک سایت نیاز دارید، می‌توانم سایت بسازم.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 text-[16.5px] leading-9 text-mist">
              اما اگر می‌خواهید یک <strong className="text-white">سیستم دیجیتال برای رشد کسب‌وکارتان</strong> بسازید، این دقیقاً جایی است که می‌توانیم با هم کار کنیم.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <Link
              to="/contact"
              className="btn-shine mt-10 inline-flex items-center gap-3 rounded-full bg-violet px-9 py-4.5 text-[16px] font-extrabold text-ink transition-all hover:bg-lilac hover:shadow-[0_0_50px_rgba(157,107,255,0.6)]"
            >
              <IconCheck className="h-5 w-5" strokeWidth={2.6} />
              ایده‌تان را به یک سیستم تبدیل کنیم
              <IconArrow className="h-4.5 w-4.5" strokeWidth={2.4} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

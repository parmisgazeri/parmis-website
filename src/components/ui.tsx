import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, toFa } from "../cms/ContentContext";

/* ================= custom inline SVG icons ================= */
type IconProps = { className?: string; strokeWidth?: number };
const S = ({ d, className, strokeWidth = 1.7 }: IconProps & { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

export const IconWeb = (p: IconProps) => (
  <S {...p} d={<>
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
    <path d="M2.5 8.5h19M5.5 6.2h.01M8 6.2h.01M10.5 6.2h.01" />
    <path d="M6 12.5h5M6 15.5h8" /><circle cx="17" cy="14.5" r="2.6" /><path d="m18.9 16.4 1.8 1.8" />
  </>} />
);
export const IconTheme = (p: IconProps) => (
  <S {...p} d={<>
    <path d="m12 2.7 9 4.5-9 4.5-9-4.5 9-4.5Z" /><path d="m3.6 12 8.4 4.2L20.4 12" /><path d="m3.6 16.6 8.4 4.2 8.4-4.2" />
  </>} />
);
export const IconPlugin = (p: IconProps) => (
  <S {...p} d={<>
    <path d="M9.5 3.5a2 2 0 0 1 4 0V5h3a2 2 0 0 1 2 2v3h-1.5a2 2 0 0 0 0 4H18.5v3a2 2 0 0 1-2 2h-3v-1.5a2 2 0 0 0-4 0V21h-3a2 2 0 0 1-2-2v-3.5H6a2 2 0 0 1 0-4H4.5V7a2 2 0 0 1 2-2h3V3.5Z" />
  </>} />
);
export const IconPlan = (p: IconProps) => (
  <S {...p} d={<>
    <circle cx="12" cy="12" r="9.2" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2" />
  </>} />
);
export const IconAi = (p: IconProps) => (
  <S {...p} d={<>
    <rect x="6" y="6" width="12" height="12" rx="2.4" /><path d="M10 10.2h.01M14 10.2h.01M9.5 14.5c.7.6 1.6.9 2.5.9s1.8-.3 2.5-.9" />
    <path d="M12 2.5V6M12 18v3.5M2.5 12H6M18 12h3.5M5 5l2 2M19 5l-2 2M5 19l2-2M19 19l-2-2" />
  </>} />
);
export const IconRocket = (p: IconProps) => (
  <S {...p} d={<>
    <path d="M12 15.5c4.5-2.6 7-6.4 7.5-11-4.6.5-8.4 3-11 7.5L12 15.5Z" /><path d="m8.5 12-4.6 1.4 3.2 2.5L8.5 12ZM12 15.5 10.6 20l-2.5-3.1L12 15.5Z" />
    <circle cx="14.7" cy="9.3" r="1.3" /><path d="M5.5 18.5c-1 .8-1.5 2-1.5 3.5 1.5 0 2.7-.5 3.5-1.5" />
  </>} />
);
export const IconCompass = (p: IconProps) => (
  <S {...p} d={<>
    <circle cx="12" cy="12" r="9.2" /><path d="m16 8-2.3 5.7L8 16l2.3-5.7L16 8Z" />
  </>} />
);
export const IconHandshake = (p: IconProps) => (
  <S {...p} d={<>
    <path d="m2.5 7 4-2.2 5.5 2.6L17.5 5l4 2.2v6.3l-2 1.2" />
    <path d="m7 11.5 3.6 3.4a1.6 1.6 0 0 0 2.2-2.3L10.5 10l1.5-1.4 4.5 4.4a1.6 1.6 0 0 1-2.2 2.3" />
    <path d="m21.5 13.5-3 3a1.6 1.6 0 0 1-2.3 0M9.5 16.9 7 14.5l-4.5 2.6 3.5 3.3a2.6 2.6 0 0 0 3.5.1l2-1.7" />
  </>} />
);
export const IconSystem = (p: IconProps) => (
  <S {...p} d={<>
    <circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="6" cy="18" r="2.4" /><circle cx="18" cy="18" r="2.4" />
    <path d="M8.4 6h7.2M6 8.4v7.2M18 8.4v7.2M8.4 18h7.2" strokeDasharray="2.6 2.6" />
  </>} />
);
export const IconPhone = (p: IconProps) => (
  <S {...p} d={<>
    <path d="M5.5 3.5h3.6l1.5 4.3-2.1 1.6a12.8 12.8 0 0 0 6.1 6.1l1.6-2.1 4.3 1.5v3.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
  </>} />
);
export const IconMail = (p: IconProps) => (
  <S {...p} d={<>
    <rect x="3" y="5" width="18" height="14" rx="2.4" /><path d="m4 7.5 8 6 8-6" />
  </>} />
);
export const IconChat = (p: IconProps) => (
  <S {...p} d={<>
    <path d="M12 3.5c4.9 0 8.8 3.3 8.8 7.4s-3.9 7.4-8.8 7.4c-1 0-2-.1-2.8-.4L4.5 19.5l1-3.5C4.1 14.7 3.2 12.9 3.2 10.9 3.2 6.8 7.1 3.5 12 3.5Z" />
    <path d="M8.3 11h.01M12 11h.01M15.7 11h.01" strokeWidth={2.4} />
  </>} />
);
export const IconArrow = (p: IconProps) => (
  <S {...p} d={<><path d="M19 12H5.5" /><path d="m11 5.5-6.5 6.5L11 18.5" /></>} />
);
export const IconArrowUpLeft = (p: IconProps) => (
  <S {...p} d={<><path d="M17 17 7.5 7.5" /><path d="M15.5 7h-8v8" /></>} />
);
export const IconQuote = (p: IconProps) => (
  <S {...p} d={<>
    <path d="M9.5 6.5C6.6 7.8 5 10 5 13.4c0 2.4 1.4 4.1 3.5 4.1 1.9 0 3.2-1.3 3.2-3.1 0-1.7-1.2-2.9-2.9-2.9h-.5c.3-1.4 1.3-2.6 2.7-3.4L9.5 6.5Z" />
    <path d="M19 6.5c-2.9 1.3-4.5 3.5-4.5 6.9 0 2.4 1.4 4.1 3.5 4.1 1.9 0 3.2-1.3 3.2-3.1 0-1.7-1.2-2.9-2.9-2.9h-.5c.3-1.4 1.3-2.6 2.7-3.4L19 6.5Z" />
  </>} />
);
export const IconCheck = (p: IconProps) => <S {...p} d={<path d="m4.5 12.5 5 5 10-11" />} />;
export const IconPlus = (p: IconProps) => <S {...p} d={<path d="M12 4.5v15M4.5 12h15" />} />;
export const IconTrash = (p: IconProps) => (
  <S {...p} d={<><path d="M4.5 6.5h15M9.5 6V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V6" /><path d="M6.5 6.5 7.4 20a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-13.5" /><path d="M10 10.5v6M14 10.5v6" /></>} />
);
export const IconDownload = (p: IconProps) => <S {...p} d={<><path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" /><path d="M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" /></>} />;
export const IconUpload = (p: IconProps) => <S {...p} d={<><path d="M12 14.5v-11M7.5 8 12 3.5 16.5 8" /><path d="M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" /></>} />;
export const IconClock = (p: IconProps) => <S {...p} d={<><circle cx="12" cy="12" r="8.8" /><path d="M12 7v5.2l3.4 2" /></>} />;
export const IconPin = (p: IconProps) => (
  <S {...p} d={<><path d="M12 21.5S5.5 15.6 5.5 10.6a6.5 6.5 0 0 1 13 0c0 5-6.5 10.9-6.5 10.9Z" /><circle cx="12" cy="10.4" r="2.3" /></>} />
);
export const IconSpark = (p: IconProps) => (
  <S {...p} d={<><path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2l-1.8-5.6-5.7-1.8L10.2 9 12 3.5Z" /><path d="M19 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" /></>} />
);
export const IconMenu = (p: IconProps) => <S {...p} d={<path d="M4 7h16M4 12h16M4 17h10" />} />;
export const IconClose = (p: IconProps) => <S {...p} d={<path d="m6 6 12 12M18 6 6 18" />} />;
export const IconSend = (p: IconProps) => <S {...p} d={<><path d="m20.5 3.5-9.4 9.4" /><path d="M20.5 3.5 14 20.5l-2.9-7.6L3.5 10 20.5 3.5Z" /></>} />;
export const IconEdit = (p: IconProps) => <S {...p} d={<><path d="m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z" /><path d="m12.5 7.5 4 4" /></>} />;
export const IconEye = (p: IconProps) => <S {...p} d={<><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></>} />;

export const SERVICE_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  web: IconWeb, theme: IconTheme, plugin: IconPlugin, plan: IconPlan, ai: IconAi,
  rocket: IconRocket, compass: IconCompass, handshake: IconHandshake, system: IconSystem,
};

/* ================= logo mark ================= */
export function LogoMark({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path d="M32 4 58 18v28L32 60 6 46V18Z" fill="#140e26" stroke="#9d6bff" strokeWidth="2.6" />
      <circle cx="32" cy="25" r="5.4" fill="#9d6bff" />
      <circle cx="19.5" cy="42" r="3.8" fill="#e8b45a" />
      <circle cx="44.5" cy="42" r="3.8" fill="#ff6ad5" />
      <path d="M32 31v3.5M28.5 29.5l-6.5 9M35.5 29.5l6.5 9" stroke="#9d6bff" strokeWidth="2.2" />
    </svg>
  );
}

/* ================= reveal on scroll ================= */
export function Reveal({
  children, className = "", delay = 0, as: Tag = "div",
}: { children: React.ReactNode; className?: string; delay?: number; as?: React.ElementType }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} data-reveal className={className} style={{ ["--rd" as never]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/* ================= scramble-decode text ================= */
const POOL = "ابپتثجچحخدرزسشصطعفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹";
export function ScrambleText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? text : text.replace(/[^ ]/g, "•")));
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setDisplay(text); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        let frame = 0;
        const total = Math.max(26, text.length * 2);
        const t0 = setTimeout(() => {
          const iv = setInterval(() => {
            frame++;
            const progress = Math.floor((frame / total) * text.length);
            let out = "";
            for (let i = 0; i < text.length; i++) {
              const ch = text[i];
              if (ch === " " || i < progress) out += ch;
              else out += POOL[Math.floor(Math.random() * POOL.length)];
            }
            setDisplay(out);
            if (frame >= total) { setDisplay(text); clearInterval(iv); }
          }, 38);
        }, delay);
        (el as unknown as { _t?: number })._t = t0;
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [text, delay]);

  return <span ref={ref} className={className}>{display}</span>;
}

/* ================= animated counter ================= */
export function Counter({ value, suffix = "", duration = 1500 }: { value: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) { setN(value); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{toFa(n)}<span className="text-gold">{suffix}</span></span>;
}

/* ================= marquee ================= */
export function Marquee({ children, speed = 32, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  return (
    <div dir="ltr" className={`marquee ${className}`}>
      <div className="marquee-track" style={{ ["--speed" as never]: `${speed}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

/* ================= section heading ================= */
export function SectionHead({
  kicker, title, desc, center = false,
}: { kicker: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <div className={`flex items-center gap-3 text-violet ${center ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-gradient-to-l from-violet to-transparent" />
          <span className="text-[13px] font-bold tracking-[0.25em] text-lilac/90">{kicker}</span>
        </div>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="mask-line mt-4 font-display text-4xl leading-[1.25] text-white sm:text-5xl">
          <span>{title}</span>
        </h2>
      </Reveal>
      {desc && (
        <Reveal delay={180}>
          <p className="mt-5 text-[15.5px] leading-8 text-mist">{desc}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ================= project cover art (SVG, no network) ================= */
const HUES = [
  { a: "#6d3df0", b: "#9d6bff", c: "#cbb4ff", tag: "text-[#cbb4ff]" },
  { a: "#a5289c", b: "#ff6ad5", c: "#ffc4ec", tag: "text-[#ffc4ec]" },
  { a: "#8a5a12", b: "#e8b45a", c: "#ffe2ae", tag: "text-[#ffe2ae]" },
  { a: "#233a8f", b: "#5a7bff", c: "#c0cdff", tag: "text-[#c0cdff]" },
];
export function ProjectCover({ hue, title, category }: { hue: 0 | 1 | 2 | 3; title: string; category: string }) {
  const h = HUES[hue] ?? HUES[0];
  const letter = title.replace(/«|»/g, "").trim().charAt(0) || "پ";
  const id = `pg${hue}`;
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <svg viewBox="0 0 400 250" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#120c22" />
            <stop offset="1" stopColor={h.a} stopOpacity="0.55" />
          </linearGradient>
          <pattern id={`${id}d`} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill={h.b} opacity="0.35" />
          </pattern>
        </defs>
        <rect width="400" height="250" fill={`url(#${id})`} />
        <rect width="400" height="250" fill={`url(#${id}d)`} />
        <g stroke={h.b} strokeOpacity="0.5" fill="none" strokeWidth="1.4">
          <path className="dash-flow" strokeDasharray="6 10" d="M-20 200 C 80 160, 140 230, 240 180 S 380 120, 430 150" />
          <path className="dash-flow" strokeDasharray="4 12" d="M-20 70 C 90 110, 170 30, 260 70 S 370 120, 430 60" style={{ animationDelay: "-4s" }} />
        </g>
        <g fill="none" stroke={h.c} strokeOpacity="0.8">
          <circle cx="72" cy="182" r="4" fill={h.b} stroke="none" />
          <circle cx="330" cy="64" r="4" fill={h.b} stroke="none" />
          <path d="M72 182 190 96l140-32" strokeDasharray="3 7" className="dash-flow" />
        </g>
        <text x="352" y="216" textAnchor="middle" fontFamily="Lalezar, serif" fontSize="128" fill={h.b} fillOpacity="0.34">{letter}</text>
        <g transform="translate(352,64)" stroke={h.c} strokeWidth="1.6" fill="none" opacity="0.9">
          <path d="M0-14v28M-14 0h28" /><circle r="20" strokeDasharray="4 6" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0714]/80 via-transparent to-transparent" />
      <span className={`absolute right-4 top-4 rounded-full border border-white/10 bg-[#0a0714]/70 px-3 py-1 text-[11.5px] font-bold ${h.tag} backdrop-blur`}>
        {category}
      </span>
    </div>
  );
}

/* ================= cursor glow ================= */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let x = -400, y = -400, tx = x, ty = y, raf = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      x += (tx - x) * 0.09; y += (ty - y) * 0.09;
      el.style.transform = `translate(${x - 220}px, ${y - 220}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[1] hidden lg:block" style={{ width: 440, height: 440 }}>
      <div className="h-full w-full rounded-full opacity-[0.11]" style={{ background: "radial-gradient(circle, #9d6bff 0%, transparent 62%)" }} />
    </div>
  );
}

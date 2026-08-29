import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../cms/ContentContext";
import { IconArrow, IconChat, IconClose, IconMail, IconMenu, IconPhone, LogoMark } from "./ui";

const NAV = [
  { to: "/", label: "خانه" },
  { to: "/about", label: "درباره من" },
  { to: "/portfolio", label: "نمونه‌کارها" },
  { to: "/courses", label: "دوره‌ها" },
  { to: "/collab", label: "پیشنهاد همکاری" },
];

export function Navbar() {
  const { content } = useCms();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-line-soft bg-ink/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="transition-transform duration-500 group-hover:rotate-[24deg]">
            <LogoMark className="h-10 w-10" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[22px] text-white">{content.settings.brandName}</span>
            <span className="block text-[10.5px] font-medium tracking-[0.22em] text-fog">DIGITAL SYSTEM STUDIO</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `link-underline text-[14.5px] font-medium transition-colors ${isActive ? "text-violet" : "text-mist hover:text-white"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="btn-shine hidden items-center gap-2 rounded-full bg-violet px-5 py-2.5 text-[14px] font-bold text-ink transition-all duration-300 hover:bg-lilac hover:shadow-[0_0_34px_rgba(157,107,255,0.5)] sm:inline-flex"
          >
            شروع پروژه
            <IconArrow className="h-4 w-4" strokeWidth={2.2} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-lilac transition-colors hover:border-violet lg:hidden"
            aria-label="منو"
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div className={`overflow-hidden border-b border-line-soft bg-ink/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${open ? "max-h-96" : "max-h-0 border-b-0"}`}>
        <nav className="flex flex-col px-6 py-4">
          {NAV.map((n, i) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              style={{ transitionDelay: `${i * 40}ms` }}
              className={({ isActive }) =>
                `border-b border-line-soft/60 py-3.5 text-[15px] font-semibold last:border-0 ${isActive ? "text-violet" : "text-mist"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link to="/contact" className="mt-3 mb-2 inline-flex items-center justify-center gap-2 rounded-full bg-violet px-5 py-3 text-[14px] font-bold text-ink">
            شروع پروژه <IconArrow className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function FloatingAdmin() {
  const { pathname } = useLocation();
  if (pathname === "/admin") return null;
  return (
    <Link
      to="/admin"
      title="پیشخوان مدیریت (CMS)"
      className="group fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-full border border-line bg-ink/85 py-2.5 pl-2.5 pr-4 backdrop-blur-xl transition-all duration-300 hover:border-violet hover:shadow-[0_0_30px_rgba(157,107,255,0.35)]"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-violet/15 text-violet transition-transform duration-500 group-hover:rotate-90">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4.5 w-4.5">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
        </svg>
      </span>
      <span className="text-[13px] font-bold text-lilac transition-colors group-hover:text-white">مدیریت سایت</span>
    </Link>
  );
}

export function Footer() {
  const { content } = useCms();
  const s = content.settings;
  return (
    <footer className="relative mt-28 border-t border-line-soft bg-ink-2/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-violet/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-11 w-11" />
              <span className="font-display text-2xl text-white">{s.studioName}</span>
            </div>
            <p className="mt-5 max-w-sm text-[14px] leading-7.5 text-mist">
              {s.tagline}. من سیستم‌های دیجیتالی می‌سازم که فقط زیبا نیستند؛ کار می‌کنند، می‌فروشند و رشد می‌کنند.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {["wordpress", "ai", "code"].map((k) => (
                <span key={k} className="rounded-full border border-line px-3.5 py-1.5 text-[11.5px] font-bold text-lilac/80">
                  {k === "wordpress" ? "WordPress" : k === "ai" ? "AI Automation" : "Web Systems"}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-lilac">دسترسی سریع</h4>
            <ul className="mt-5 space-y-3.5 text-[14px]">
              {[...NAV.slice(1), { to: "/contact", label: "تماس با من" }].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="link-underline text-mist transition-colors hover:text-white">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-lilac">خدمات</h4>
            <ul className="mt-5 space-y-3.5 text-[14px]">
              {content.services.slice(0, 5).map((sv) => (
                <li key={sv.id}>
                  <Link to="/contact" className="link-underline text-mist transition-colors hover:text-white">{sv.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-lilac">تماس مستقیم</h4>
            <ul className="mt-5 space-y-4 text-[14px]">
              <li>
                <a href={`tel:${s.phone}`} className="group flex items-center gap-3 text-mist transition-colors hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-violet transition-colors group-hover:border-violet">
                    <IconPhone className="h-4 w-4" />
                  </span>
                  <span className="ltr font-semibold tracking-wide">{s.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className="group flex items-center gap-3 text-mist transition-colors hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-violet transition-colors group-hover:border-violet">
                    <IconMail className="h-4 w-4" />
                  </span>
                  <span className="ltr text-[13px]">{s.email}</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/98${s.phone.slice(1)}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-mist transition-colors hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-violet transition-colors group-hover:border-violet">
                    <IconChat className="h-4 w-4" />
                  </span>
                  <span>واتس‌اپ — پاسخ سریع</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-line-soft pt-8 sm:flex-row">
          <p className="text-[13px] text-fog">
            © {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())} {s.studioName} — تمام حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-6 text-[13px]">
            <Link to="/export" className="link-underline text-fog transition-colors hover:text-violet">دانلود سورس (ZIP)</Link>
            <Link to="/admin" className="link-underline text-fog transition-colors hover:text-violet">پیشخوان مدیریت (CMS)</Link>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="link-underline text-fog hover:text-violet">
              بازگشت به بالا ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

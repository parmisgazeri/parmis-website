import React, { lazy, Suspense, useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { CmsProvider } from "./cms/ContentContext";
import { FloatingAdmin, Footer, Navbar } from "./components/layout";
import { CursorGlow } from "./components/ui";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Courses from "./pages/Courses";
import Collaboration from "./pages/Collaboration";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

/* اگر بارگذاری صفحه دانلود به هر دلیلی شکست خورد، پیام راهنما نشان بده */
function ExportFallback() {
  return (
    <div dir="rtl" className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md rounded-3xl border border-magenta/40 bg-surface p-8 text-center">
        <div className="text-4xl">📦</div>
        <h1 className="mt-4 font-display text-2xl text-magenta">صفحه دانلود بارگذاری نشد!</h1>
        <p className="mt-3 text-[13.5px] leading-7 text-mist">
          یک بار با <b className="ltr text-lilac">Ctrl + Shift + R</b> رفرش کامل بزن؛ اگر درست نشد پیش‌نمایش را در یک تب جدید باز کن.
        </p>
        <button onClick={() => window.location.reload()} className="mt-6 w-full rounded-full bg-violet py-3 text-[14px] font-extrabold text-ink">
          🔄 بارگذاری دوباره
        </button>
      </div>
    </div>
  );
}

/* صفحه دانلود فقط در حالت توسعه بارگذاری می‌شود.
   مسیر به‌صورت متغیر و با @vite-ignore آمده تا Rollup در بیلد نهایی اصلاً دنبال
   این فایل نگردد و آن را به‌عنوان Asset هم کپی نکند — پس در گیت‌هاب نیازی به آپلودش نیست. */
const EXPORT_MODULE = "./pages/" + "Export.tsx";
const Export = import.meta.env.DEV
  ? lazy(() =>
      import(/* @vite-ignore */ EXPORT_MODULE).catch((err) => {
        console.error("خطای بارگذاری صفحه دانلود:", err);
        return { default: ExportFallback };
      })
    )
  : undefined;

/* صفحه «کپی فایل‌ها برای گیت‌هاب» — فقط در حالت توسعه */
const COPY_MODULE = "./pages/" + "CopyFiles.tsx";
const CopyFiles = import.meta.env.DEV
  ? lazy(() =>
      import(/* @vite-ignore */ COPY_MODULE).catch((err) => {
        console.error("خطای بارگذاری صفحه کپی:", err);
        return { default: ExportFallback };
      })
    )
  : undefined;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function Shell() {
  return (
    <div className="relative min-h-screen">
      <div className="ambient" />
      <div className="ambient-grid" />
      <div className="noise" />
      <CursorGlow />
      <ScrollToTop />
      <Navbar />
      <FloatingAdmin />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/collab" element={<Collaboration />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          {/* صفحه دانلود فقط در حالت توسعه (npm run dev) فعال است و در سایت نهایی دیده نمی‌شود */}
          {import.meta.env.DEV && <Route path="/export" element={<ExportPage />} />}
          {import.meta.env.DEV && <Route path="/copy" element={<CopyPage />} />}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div dir="rtl" className="grid min-h-screen place-items-center bg-ink px-6">
          <div className="max-w-xl rounded-3xl border border-magenta/40 bg-surface p-8 text-center">
            <h1 className="font-display text-2xl text-magenta">خطایی رخ داد</h1>
            <p className="mt-3 text-[13px] leading-7 text-mist">{this.state.error.message}</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => this.setState({ error: null })}
                className="rounded-full bg-violet px-6 py-2.5 text-[14px] font-bold text-ink transition-colors hover:bg-lilac"
              >
                تلاش دوباره
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full border border-line px-6 py-2.5 text-[13px] font-bold text-lilac transition-colors hover:border-violet"
              >
                بارگذاری کامل صفحه
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ExportPage() {
  if (!Export) return null;
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center pt-[74px]">
            <div className="flex flex-col items-center gap-4">
              <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet/25 border-t-violet" />
              <span className="text-[13px] font-bold text-fog">در حال بارگذاری صفحه دانلود...</span>
            </div>
          </div>
        }
      >
        <Export />
      </Suspense>
    </ErrorBoundary>
  );
}

function CopyPage() {
  if (!CopyFiles) return null;
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center pt-[74px]">
            <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet/25 border-t-violet" />
          </div>
        }
      >
        <CopyFiles />
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <CmsProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </CmsProvider>
    </ErrorBoundary>
  );
}

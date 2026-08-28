import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/* ─────────────────────────────────────────────────────────────
   فهرست فایل‌های پروژه — برای صفحه «دانلود سورس»
   این پلاگین محتوا را مستقیم از دیسک می‌خواند و به‌صورت
   ماژول مجازی (virtual:project-files) در اختیار صفحه می‌گذارد.
   ───────────────────────────────────────────────────────────── */
const PROJECT_FILES = [
  "package.json",
  "index.html",
  "tsconfig.json",
  "vite.config.js",
  "README.md",
  ".gitignore",
  ".github/workflows/deploy-pages.yml",
  "src/App.tsx",
  "src/main.tsx",
  "src/index.css",
  "src/vite-env.d.ts",
  "src/cms/ContentContext.tsx",
  "src/cms/defaultContent.ts",
  "src/components/layout.tsx",
  "src/components/ui.tsx",
  "src/components/three/HeroScene.tsx",
  "src/lib/zip.ts",
  "src/pages/Home.tsx",
  "src/pages/About.tsx",
  "src/pages/Portfolio.tsx",
  "src/pages/Courses.tsx",
  "src/pages/Collaboration.tsx",
  "src/pages/Contact.tsx",
  "src/pages/Admin.tsx",
  "src/pages/Export.tsx",
];

function projectFilesPlugin() {
  const VIRTUAL_ID = "virtual:project-files";
  const RESOLVED_ID = "\0" + VIRTUAL_ID;
  return {
    name: "project-files",
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const out = [];
      for (const rel of PROJECT_FILES) {
        try {
          const p = path.join(rootDir, rel);
          if (fs.existsSync(p)) out.push([rel, fs.readFileSync(p, "utf-8")]);
        } catch {
          /* اگر فایلی نبود، رد شو */
        }
      }
      return `export const PROJECT_FILES = ${JSON.stringify(out)};`;
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), projectFilesPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});

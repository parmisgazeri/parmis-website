/// <reference types="vite/client" />

declare module "virtual:project-files" {
  /** لیست فایل‌های پروژه به‌صورت [مسیر, محتوا] */
  export const PROJECT_FILES: [string, string][];
}

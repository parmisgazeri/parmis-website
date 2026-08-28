# 🚀 وب‌سایت پارمیس — استودیو دیجیتال پارمیس

وب‌سایت سه‌بعدی با پیشخوان مدیریت محتوا (CMS)
**React + Vite + TypeScript + Tailwind CSS + Three.js**

---

## 📂 ساختار فایل‌های پروژه

```
parmis-website/
│
├── src/                          ← کدهای اصلی سایت
│   ├── cms/
│   │   ├── ContentContext.tsx    ← لایه CMS (ذخیره و بازیابی محتوا)
│   │   └── defaultContent.ts     ← محتوای پیش‌فرض سایت (خدمات، دوره‌ها، نمونه‌کارها...)
│   ├── components/
│   │   ├── three/
│   │   │   └── HeroScene.tsx     ← صحنه سه‌بعدی صفحه اصلی
│   │   ├── layout.tsx            ← منو، فوتر و دکمه شناور مدیریت
│   │   └── ui.tsx                ← آیکون‌ها و کامپوننت‌های مشترک
│   ├── pages/
│   │   ├── Home.tsx              ← صفحه اصلی
│   │   ├── About.tsx             ← درباره من
│   │   ├── Portfolio.tsx         ← نمونه‌کارها
│   │   ├── Courses.tsx           ← دوره‌ها
│   │   ├── Collaboration.tsx     ← پیشنهاد همکاری
│   │   ├── Contact.tsx           ← تماس با من
│   │   └── Admin.tsx             ← پیشخوان مدیریت (CMS)
│   ├── App.tsx                   ← مسیربندی صفحات
│   ├── index.css                 ← رنگ‌ها، فونت‌ها و انیمیشن‌ها
│   └── main.tsx                  ← نقطه شروع برنامه
│
├── .github/workflows/
│   └── deploy-pages.yml          ← انتشار خودکار روی GitHub Pages (اختیاری)
│
├── .gitignore                    ← فایل‌هایی که نباید به گیت‌هاب بروند
├── index.html                    ← پوسته اصلی صفحه
├── package.json                  ← لیست پکیج‌ها و دستورات
├── tsconfig.json                 ← تنظیمات تایپ‌اسکریپت
└── vite.config.js                ← تنظیمات بیلد
```

## ⚠️ مهم: چه چیزهایی نباید به گیت‌هاب بروند

- پوشه `node_modules/` (چندصد مگابایت — موقع نصب دوباره ساخته می‌شود)
- پوشه `dist/` (خروجی بیلد — Vercel خودش می‌سازد)

فایل `.gitignore` به‌صورت خودکار جلوی این دو را می‌گیرد.

## 💻 اجرای لوکال

```bash
npm install
npm run dev
```
→ مرورگر: `http://localhost:5173`

## 📦 ساخت نسخه نهایی

```bash
npm run build
```
→ خروجی در پوشه `dist`

## 🐙 آپلود روی GitHub

```bash
git init
git add .
git commit -m "Parmis website"
git remote add origin https://github.com/USERNAME/parmis-website.git
git branch -M main
git push -u origin main
```

## 🌍 انتشار روی Vercel (رایگان)

1. [vercel.com](https://vercel.com) → ورود با اکانت گیت‌هاب
2. Add New → Project → انتخاب ریپازیتوری → Deploy
3. Build Command: `npm run build` — Output: `dist` (خودکار تشخیص داده می‌شود)

## 🔗 اتصال دامنه

در داشبورد Vercel: **Settings → Domains** → وارد کردن دامنه → رکوردهای زیر را در پنل DNS دامنه اضافه کنید:

| نوع | نام | مقدار |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

## 🛠 پیشخوان مدیریت (CMS)

- مسیر: `/#/admin` (یا دکمه شناور «مدیریت سایت» پایین صفحه)
- اطلاعات ورود در ابتدای فایل `src/pages/Admin.tsx` تعریف شده است
- تغییرات به‌صورت خودکار در مرورگر ذخیره می‌شوند — از تب «پشتیبان‌گیری» فایل JSON دانلود کنید

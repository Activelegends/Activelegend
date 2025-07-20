# ActiveLegend 2D Web Game Engine

این پروژه شامل یک موتور بازی ۲بعدی تحت وب با React، TypeScript، TailwindCSS و Framer Motion است که هم حالت آنلاین (با WebSocket/Supabase Realtime) و هم آفلاین را پشتیبانی می‌کند.

## امکانات کلیدی
- صفحه اصلی مدرن و مینیمال با انتخاب حالت آنلاین/آفلاین
- اتصال real-time به سرور WebSocket یا Supabase Realtime
- نمایش چند پلیر هم‌زمان و همگام‌سازی موقعیت
- محیط کدنویسی درون بازی با sandbox امن
- محدودیت اجرا و امکانات ویژه برای کاربران دونیت‌دار
- جدول امتیاز و کارت پلیرها با اسم و آواتار
- انیمیشن‌های نرم و UI/UX حرفه‌ای

## شروع سریع
1. `npm install`
2. اجرای پروژه: `npm run dev`
3. ورود به صفحه بازی: `/game`
4. برای حالت آنلاین، یک سرور WebSocket راه‌اندازی کنید (نمونه کد در انتهای این فایل)

### فایل اصلی بازی: `src/pages/GameEngine.tsx`

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F4B744',
        'primary-dark': '#E5A93A',
        secondary: '#2C3E50',
        'secondary-dark': '#1A252F',
      },
      fontFamily: {
        'iransans': ['IRANSans', ...defaultTheme.fontFamily.sans],
        'vazir': ['Vazir', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      blur: {
        '4xl': '100px',
        '5xl': '160px',
      },
    },
  },
  plugins: [],
}
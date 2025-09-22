/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // مهم علشان الـ toggle يشتغل
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // لو بتستخدم TypeScript
  ],
  theme: {
    extend: {
      colors: {
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite', // 3 ثواني لكل دورة
      }
    },
  },
  plugins: [],
};

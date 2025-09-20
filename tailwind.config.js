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
        // تقدر تضيف ألوانك المخصصة هنا
      },
    },
  },
  plugins: [],
};

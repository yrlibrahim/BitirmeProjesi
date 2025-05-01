/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#212B36", // metin rengi tanımı
      },
      fontFamily: {
        nunito: ['"Nunito"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

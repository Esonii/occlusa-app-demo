/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        occlusa: "#4490cf",       // your brand blue
        occlusaLight: "#e6f2fb",  // optional lighter background tint
      },
    },
  },
  plugins: [],
};

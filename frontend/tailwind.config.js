/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mazars-blue': '#003366',
        'mazars-light-blue': '#0066CC',
        'mazars-green': '#009933',
        'mazars-orange': '#FF6600',
      },
    },
  },
  plugins: [],
}

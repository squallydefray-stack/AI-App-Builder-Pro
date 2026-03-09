/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
  ],
    theme: {
      extend: {
        keyframes: {
          "blink-fast": { "0%, 50%, 100%": { opacity: 1 }, "25%, 75%": { opacity: 0 } },
          "blink-slow": { "0%, 50%, 100%": { opacity: 1 }, "25%, 75%": { opacity: 0 } },
        },
        animation: {
          "blink-fast": "blink-fast 0.5s step-start infinite",
          "blink-slow": "blink-slow 1s step-start infinite",
        },
      },
    },
  plugins: [],
};

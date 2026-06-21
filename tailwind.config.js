/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F4D",
          50: "#EEF1F8",
          100: "#D7DEEC",
          400: "#3A4F85",
          600: "#0F2A63",
          700: "#0B1F4D",
          800: "#081640",
          900: "#050F2E",
        },
        surface: "#F8FAFC",
        border: "#E5E7EB",
        ink: "#1E293B",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(11,31,77,0.04), 0 1px 3px 0 rgba(11,31,77,0.06)",
        panel: "0 4px 24px -4px rgba(11,31,77,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

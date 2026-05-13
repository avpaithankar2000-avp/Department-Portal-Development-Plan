/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        brand: "#0f766e",
        coral: "#f97316",
        skysoft: "#e0f2fe",
        night: "#07111f"
      },
      boxShadow: {
        soft: "0 16px 45px rgba(15, 23, 42, 0.08)",
        glow: "0 24px 80px rgba(20, 184, 166, 0.22)",
        night: "0 22px 70px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "premium-light":
          "radial-gradient(circle at top left, rgba(20,184,166,0.18), transparent 34%), radial-gradient(circle at 85% 15%, rgba(249,115,22,0.14), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #eef7f6 48%, #f8fafc 100%)",
        "premium-dark":
          "radial-gradient(circle at top left, rgba(20,184,166,0.22), transparent 32%), radial-gradient(circle at 90% 10%, rgba(56,189,248,0.16), transparent 26%), linear-gradient(135deg, #07111f 0%, #0f172a 52%, #111827 100%)"
      }
    }
  },
  plugins: []
};

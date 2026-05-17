/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f8fafc",
          100: "#e2e8f0",
          400: "#64748b",
          500: "#475569",
          600: "#334155",
          700: "#1e293b"
        },
        accent: {
          100: "#eff6ff",
          500: "#3b82f6"
        },
        surface: {
          900: "#ffffff",
          800: "#f8fafc",
          700: "#f1f5f9"
        }
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        glass: "0 20px 60px rgba(15,23,42,0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(59,130,246,0.07), transparent 26%), radial-gradient(circle at bottom right, rgba(148,163,184,0.08), transparent 30%), linear-gradient(180deg, rgba(248,250,252,1), rgba(255,255,255,1))"
      }
    }
  },
  plugins: []
};

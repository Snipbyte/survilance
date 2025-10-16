/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        darkCard: "#1e293b", //slate-800
        lightCard: "#f3f4f6", //gray-100
        headingColor: "#0f172a", //slate-900
        slateColor: "#cbd5e1", //slate-300
        desColor: "#0f172a", //slate-900
        paraColor: "#9ca3af", //gray-400
        btnColor: "#0f172a", //slate-900
        blueColor: "#4f46e5", // blue-600
        hoverBtnColor: "#1e293b", //slate-800
        themeColor: "#020617", //slate-950
      },
      animation: {
        marqueeXtoY: "scrollXtoY 10s linear infinite",
        marqueeYtoX: "scrollYtoX 10s linear infinite",
      },
      keyframes: {
        scrollXtoY: {
          "0%": { transform: "translateY(50%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        scrollYtoX: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(50%)" },
        },
      },
    },
  },
  plugins: [],
};

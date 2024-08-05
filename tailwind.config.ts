import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        display: 'Inter, sans-serif', // Adds a new `font-display` class
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "post-pro": {
          extends: "light",
          colors: {
            default: {
              50: "#ffffff",
              100: "#e1e7ed",
              200: "#c3cfdc",
              300: "#a5b7ca",
              400: "#879fb9",
              500: "#6482AD", // Base color
              600: "#556b94",
              700: "#45557b",
              800: "#364062",
              900: "#293547",
            },
            primary: {
              50: "#f0f3f6",
              100: "#e1e7ed",
              200: "#c3cfdc",
              300: "#a5b7ca",
              400: "#879fb9",
              500: "#6482AD", // Base color
              600: "#556b94",
              700: "#45557b",
              800: "#364062",
              900: "#293547",
            },
            secondary: {
              50: "#f4f2ff",
              100: "#e9e5ff",
              200: "#c8baff",
              300: "#a793ff",
              400: "#6b3dff",
              500: "#2e00e6",
              600: "#2900cd",
              700: "#1e00a3",
              800: "#16007a",
              900: "#0b004a",
            },
            danger: {
              50: "#fff7f7",
              100: "#ffefef",
              200: "#ffcece",
              300: "#ffadad",
              400: "#ff6b6b",
              500: "#ff2929",
              600: "#e62626",
              700: "#b31d1d",
              800: "#801515",
              900: "#4d0c0c",
            },
            success: {
              50: "#f7fff7",
              100: "#efffef",
              200: "#ceffce",
              300: "#adffad",
              400: "#6bff6b",
              500: "#29ff29",
              600: "#26e626",
              700: "#1db31d",
              800: "#158015",
              900: "#0c4d0c",
            },
            warning: {
              50: "#fffcf7",
              100: "#fff9ef",
              200: "#ffefce",
              300: "#ffe9ad",
              400: "#ffd96b",
              500: "#ffca29",
              600: "#e6b526",
              700: "#b39a1d",
              800: "#807e15",
              900: "#4d4f0c",
            },
            info: {
              50: "#f7f9ff",
              100: "#eff3ff",
              200: "#ced7ff",
              300: "#adbbff",
              400: "#6b83ff",
              500: "#294bff",
              600: "#263fe6",
              700: "#1d33b3",
              800: "#152780",
              900: "#0c174d",
            },
          },
        },
      },
    }),
  ],
};
export default config;

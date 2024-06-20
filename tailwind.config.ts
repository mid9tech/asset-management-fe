import type { Config } from "tailwindcss";



const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'nashtech':'#cf2338',
        'bluegray': '#eff1f5',
        'cyangray': '#fafcfc',
        'graycustom': '#949494',
        'graycustom2': '#f5f5f5',
        'gray': '#707070',
        'header-modal': '#EFF1F5',
        'border-gray': 'rgba(222, 226, 230, 1);'
      },
      spacing: {
        '26': '6.7rem',
      }
    },
  },
  plugins: [],
};
export default config;

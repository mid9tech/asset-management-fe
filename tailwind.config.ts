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
        'custom-gradient': 'linear-gradient(90deg, #4A3EAE 0.02%, #D655A5 73.23%, #FF9C8D 99.71%);',
      },
      colors: {
        'nashtech': '#000',
        'bluegray': '#eff1f5',
        'cyangray': '#fafcfc',
        'graycustom': '#949494',
        'graycustom2': '#f5f5f5',
        'gray': '#707070',
        'blue' :'#5AB1EC',
        'disable': '#F0F1F4',
        'header-modal': '#EFF1F5',
        'input-gray': '#EFF1F5',
        'border-gray': 'rgba(222, 226, 230, 1);',
        'gradient': 'linear-gradient(90deg, #4A3EAE 0.02%, #D655A5 73.23%, #FF9C8D 99.71%)'
      },
      spacing: {
        '26': '6.7rem',
      }
    },
  },
  variants: {
    extend: {
      ringColor: ['focus'],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;

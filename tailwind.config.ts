import type { Config } from "tailwindcss";
import tailwindScrollBarHide from 'tailwind-scrollbar-hide';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(2vh)',
          },
          '100%': {
            opacity: '1',
          },
        },
        "float": {
          "0%": {
            transform: 'translateY(1vh)'
          },
          "50%": {
            transform: 'translateY(-1vh)'
          },
          "100%": {
            transform: 'translateY(1vh)'
          },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'float': 'float 5s ease-in-out infinite'
      },
    },
  },
  plugins: [ tailwindScrollBarHide ],
};
export default config;

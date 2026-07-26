import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f8',
          100: '#d7e0ee',
          200: '#b3c4dd',
          300: '#8aa4c8',
          400: '#5c7ea9',
          500: '#3d6191',
          600: '#2c4b76',
          700: '#1f3a5f',
          800: '#162b49',
          900: '#0e1c30',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faedc6',
          200: '#f5db8d',
          300: '#efc554',
          400: '#e5ab2b',
          500: '#c98f1c',
          600: '#a56f16',
          700: '#7e5314',
          800: '#5c3d13',
          900: '#402c11',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

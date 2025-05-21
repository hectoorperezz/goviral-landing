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
        sans: [
          'Inter var',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'var(--font-geist-mono)',
          'SF Mono',
          'Menlo',
          'monospace'
        ],
        display: [
          'Inter var',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        'apple-blue': '#0071e3',
        'apple-blue-dark': '#0051a2',
        'apple-gray': {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#b8b8bf',
          400: '#86868b',
          500: '#6e6e73',
          600: '#404045',
          700: '#2d2d30',
          800: '#1d1d1f',
          900: '#0a0a0a',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "apple-gradient": "linear-gradient(90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
      },
      boxShadow: {
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'apple-md': '0 8px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'apple-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'apple-button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'apple': '12px',
        'apple-sm': '8px',
        'apple-lg': '16px',
        'apple-xl': '22px',
      },
    },
  },
  plugins: [],
};

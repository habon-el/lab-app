/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './client/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0F1012',
        panel: '#17191D',
        accent: '#C7A56B'
      }
    }
  },
  plugins: []
};

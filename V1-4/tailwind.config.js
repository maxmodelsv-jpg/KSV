/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0A0A0A',
        'dark-2': '#18181B',
        muted: '#71717A',
        'body-muted': '#52525B',
        accent: '#DC2626',
        'accent-hover': '#B91C1C',
        'light-bg': '#FAFAFA',
        border: '#E4E4E7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

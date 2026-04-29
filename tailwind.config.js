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
        tech: '#06B6D4',
        'tech-dim': 'rgba(6,182,212,0.15)',
        'light-bg': '#FAFAFA',
        border: '#E4E4E7',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--r-md)',
      },
      boxShadow: {
        'token-sm': 'var(--sh-sm)',
        'token-md': 'var(--sh-md)',
        'token-lg': 'var(--sh-lg)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        soft: 'var(--ease-out-soft)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
      height: {
        'btn-sm': 'var(--btn-sm)',
        'btn-md': 'var(--btn-md)',
        'btn-lg': 'var(--btn-lg)',
      },
    },
  },
  plugins: [],
};

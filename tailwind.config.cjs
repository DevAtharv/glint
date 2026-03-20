/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#00e628',
        'primary-hover': '#00ff2f',
        'bg-main': '#131313',
        'bg-card': '#1b1b1b',
        'bg-surface': '#2a2a2a',
        'text-main': '#e2e2e2',
        'text-muted': '#888888',
        'border': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

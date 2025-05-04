/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#278783',
        secondary: '#FFEBD0',
        light: '#88ddd8',
        dark: '#121212',
      },
      fontFamily: {
        leonetta: ['Leonetta Serif', 'serif'],
        siptext: ['LTSipText-Regular', 'sans-serif'],
        navara: ['Navara', 'sans-serif'],
        delon: ['Delon', 'sans-serif'],
        hogira: ['Hogira', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


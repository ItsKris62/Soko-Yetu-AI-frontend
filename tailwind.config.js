/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          // Primary Pair: Montserrat for headings and Open Sans for body text.
          heading: ['Montserrat', 'sans-serif'],
          body: ['Open Sans', 'sans-serif'],
          // Accent: Raleway for UI flourishes.
          accent: ['Raleway', 'sans-serif'],
          // Optional Monospace for technical outputs.
          mono: ['Source Code Pro', 'monospace'],
        },
        colors: {
          primary: '#85FFC7',
          secondary: '#297373',
          accent: '#FF8552',
          neutral: '#E6E6E6',
          dark: '#1A1A1A',
          white: '#FFFFFF'
        },
      },
    },
    plugins: [],
  }
  
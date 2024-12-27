/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#ebebeb',
        secondary: '#14141c',
        main: '#9b4dca',
      },
      fontFamily: {
        logo: ['Pacifico', 'serif'],
        main: ['Red Hat Display', 'serif'],
      },
    },
  },
  plugins: [],
}


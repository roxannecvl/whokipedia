/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.vue'],
  theme: {
    extend: {
      backgroundImage: {
        'logo-filled': "url('/img/logo-filled.png')",
      },
    },
  },
  plugins: [],
}


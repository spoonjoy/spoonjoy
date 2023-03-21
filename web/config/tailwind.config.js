/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: ['../src/**/*.{js,jsx,ts,tsx}'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html', // Adjusted to match the HTML files in your public directory
    './public/**/*.js', // Adjusted to match the JavaScript files in your public directory
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0067b6', // Custom color for your footer
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // other plugins if needed
  ],
}


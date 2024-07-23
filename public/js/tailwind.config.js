/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../**/*.html', // Adjusted to match the HTML files in the parent directory of js
    '../**/*.js', // Adjusted to match the JavaScript files in the parent directory of js
  ],
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

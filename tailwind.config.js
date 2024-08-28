/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',  // Ensure paths cover your HTML and JS files
    './public/**/*.html',               // Ensure paths cover your HTML files in public
  ],

  theme: {
    extend: {
      colors: {
        'custom-blue': '#0067b6', // Custom color for your footer
      },
      maxWidth: {
        'custom-xl': '1140px',
      },
    },
  },
  plugins: [],
}



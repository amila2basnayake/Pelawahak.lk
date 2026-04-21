/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wedding-gold': '#E6C200',
        'wedding-cream': '#FAF7F0',
        'wedding-brown': '#8D6E63',
      }
    },
  },
  plugins: [],
}

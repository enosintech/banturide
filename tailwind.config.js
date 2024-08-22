/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-primary" : "#222831",
        "dark-secondary" : "#3b434e",
        "dark-tertiary" : "#5a626e",
        "dark-main" : "#0e1115"
      }
    },
  },
  plugins: [],
}


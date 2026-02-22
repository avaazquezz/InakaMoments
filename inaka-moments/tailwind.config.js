/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        inaka: {
          terra: '#8B3A2A',
          gold:  '#C9A96E',
          mauve: '#C4909A',
          beige: '#D4BFA0',
          nude:  '#E8D0C8',
          cream: '#FAFAF8',
        },
      },
    },
  },
  plugins: [],
}

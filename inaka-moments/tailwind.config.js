/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        inaka: {
          terra: '#8B3A2A',
          gold: '#C9A96E',
          mauve: '#C4909A',
          beige: '#D4BFA0',
          nude: '#E8D0C8',
          cream: '#FAFAF8',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      typography: ({ theme }) => ({
        inaka: {
          css: {
            '--tw-prose-body': theme('colors.inaka.terra / 85%'),
            '--tw-prose-headings': theme('colors.inaka.terra'),
            '--tw-prose-links': theme('colors.inaka.terra'),
            '--tw-prose-bold': theme('colors.inaka.terra'),
            '--tw-prose-bullets': theme('colors.inaka.gold'),
            '--tw-prose-hr': theme('colors.inaka.beige'),
            '--tw-prose-quotes': theme('colors.inaka.terra'),
            '--tw-prose-quote-borders': theme('colors.inaka.gold'),
            'fontFamily': theme('fontFamily.sans').join(', '),
            'h1, h2, h3': { fontFamily: theme('fontFamily.display').join(', ') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

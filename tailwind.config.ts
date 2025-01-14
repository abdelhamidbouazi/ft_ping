import type { Config } from 'tailwindcss'
const {nextui} = require("@nextui-org/react");
const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'midnight': '#010100d9',
      'midnight-light': '#2e2a4d',
      'midnight-border': '#0d0840',
      'midnight-secondary': '#5750a6',
    },
    extend: {
      fontFamily: {
        gaming: ['Press Start 2P'],
        sans: ['Press Start 2P'],

      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({addCommonColors: true}), require('tailwind-scrollbar'),]
}
export default config

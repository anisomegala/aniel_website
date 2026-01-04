const { fontFamily } = require('tailwindcss/defaultTheme')


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'col-span-4',
    'col-span-8',
    'col-span-12',
    'row-span-1',
    'row-span-2',
    'row-span-3',
    'md:col-span-6',
    'md:col-span-12',
  ],
  darkMode: 'class',
  theme: {
      extend: {
        fontFamily: {
          pp: ['var(--font-pp)'],
        },
        colors: {
            dark: "#663300",
            light: "#f5f5f5",
            primary: "#bb9966", // 240,86,199
            primaryDark: "#996633", // 80,230,217
            primaryText: "#1b1b1b", // black
        }, 
        animation: {
          'spin-slow': 'spin 10s linear infinite',
        },
        backgroundImage: {
          circularLight: 'repeating-radial-gradient(#bb9966 1.5px,#f5f5f5 5px,#f5f5f5 100px);',
          circularDark: 'repeating-radial-gradient(#bb9966 1.5px,#663300 5px,#663300 100px);',
          circularLightLg: 'repeating-radial-gradient(#bb9966 1.5px,#f5f5f5 5px,#f5f5f5 80px);',
          circularDarkLg: 'repeating-radial-gradient(#bb9966 1.5px,#663300 5px,#663300 80px);'
        }
      },
      screens: {
    "2xl": { max: "1535px" },
    // => @media (max-width: 1535px) { ... }

    xl: { max: "1279px" },
    // => @media (max-width: 1279px) { ... }

    lg: { max: "1023px" },
    // => @media (max-width: 1023px) { ... }

    md: { max: "767px" },
    // => @media (max-width: 767px) { ... }

    sm: { max: "639px" },
    // => @media (max-width: 639px) { ... }

    xs: { max: "479px" },
    // => @media (max-width: 479px) { ... }
    },
  },
  plugins: [],
}


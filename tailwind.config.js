/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
    './client/src/pages/**/*.{html,js,ts,tsx}',
    './client/src/components/**/*.{html,js,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#42b883',
          500: '#347474',
          600: '#35495e',
          700: '#ff7e67',
        },
        accents: {
          100: '#f0f2f2',
          200: '#24b0ba',
          300: '#ccd2c7',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"'],
        poppins: ['"Poppins"'],
      },
      fontWeight: {
        thin: 200,
        light: 300,
        normal: 400,
      },
    },
  },
  plugins: [require('daisyui')],

  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'light', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root', // The element that receives theme color CSS variables
  },
};

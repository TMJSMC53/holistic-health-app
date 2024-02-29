/** @type {import('tailwindcss').Config} */

const pxToRem = (px, base = 16) => {
  return `${px / base}rem`;
};

const generateFontSize = () => {
  const fontSize = {};

  const minFontSize = 12;
  const maxFontSize = 100;

  for (let i = minFontSize; i <= maxFontSize; i += 2) {
    fontSize[i] = pxToRem(i);
  }

  return fontSize;
};

const generateBorderRadius = (max = 24) => {
  const borderRadius = Array.from(Array(max + 1).keys()).reduce((acc, cur) => {
    if (cur % 2 !== 0) {
      return acc;
    }

    acc[cur] = pxToRem(cur);
    return acc;
  }, {});
  borderRadius['full'] = '9999px';

  return borderRadius;
};

export default {
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
    './client/src/pages/**/*.{html,js,ts,tsx}',
    './client/src/components/**/*.{html,js,ts,tsx}',
  ],
  theme: {
    borderRadius: generateBorderRadius(),
    fontSize: generateFontSize(),
    extend: {
      boxShadow: {
        custom:
          'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
      },
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
        medium: 500,
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

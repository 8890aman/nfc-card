/* eslint-disable no-undef */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'neo-black': {
          900: '#0A0A0A',
          800: '#141414',
          700: '#1E1E1E',
          600: '#282828',
        },
        'neo-green': {
          500: '#00FF00',
          400: '#33FF33',
          300: '#66FF66',
          200: '#99FF99',
        },
        'matrix-green': '#00FF41',
        'neon-green': '#39FF14',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      animation: {
        'fall': 'fall 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'revolve': 'revolve 20s linear infinite',
        'revolve-reverse': 'revolve 25s linear infinite reverse',
        'pulse': 'pulse 4s ease-in-out infinite',
      },
      blob: {
        'position' : "absolute",
        'width' : "300px",
        'height' : "300px",
        'background' : "rgba(0, 0, 0, 0.3)",
        'border-radius' : "50%",
        'filter' : "blur(100px)",
        'animation' : "moveBlob 10s infinite"
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 0.8 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        revolve: {
          '0%': { transform: 'rotate(0deg) translateX(50%) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(50%) rotate(-360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(0.95)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        moveBlob: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(50vw, 50vh) scale(1.5)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        }
      },
    },
  },
  plugins: [],
});
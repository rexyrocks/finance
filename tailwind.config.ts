import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          0: '#FAFAF8',
          50: '#F2F1ED',
          100: '#E7E5DF',
          200: '#C9C6BC',
          DEFAULT: '#0A0B0D',
          900: '#0A0B0D',
          850: '#101114',
          800: '#15161A',
          700: '#1C1D22',
          600: '#26272D',
          500: '#3A3C44',
        },
        gold: {
          50: '#FBF4E4',
          100: '#F3E3BC',
          200: '#E8CC8A',
          300: '#DCB55C',
          400: '#D4A24E',
          500: '#C28F3A',
          600: '#9C722C',
          700: '#76561F',
        },
        emerald: {
          50: '#E8F7F0',
          100: '#C3ECDA',
          300: '#5CCB9A',
          400: '#27AD78',
          500: '#1C8F62',
          600: '#136E4B',
        },
        coral: {
          50: '#FBEAEA',
          100: '#F3C6C6',
          300: '#E58888',
          400: '#DA5C5C',
          500: '#C3403F',
          600: '#9C2F2E',
        },
        sapphire: {
          50: '#E9F1FB',
          100: '#C3DAF3',
          300: '#7FAEE3',
          400: '#4D8AD2',
          500: '#326CB0',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-light': '0 1px 2px rgba(10,11,13,0.06), 0 0 0 1px rgba(10,11,13,0.05)',
        glow: '0 0 40px rgba(212,162,78,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

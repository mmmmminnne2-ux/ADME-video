import type { Config } from 'tailwindcss';
export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080A0C',
        panel: '#11151a',
        accent: '#8b5cf6',
        muted: '#8b95a7'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,.4), 0 0 30px rgba(139,92,246,.2)'
      }
    }
  },
  plugins: []
} satisfies Config;

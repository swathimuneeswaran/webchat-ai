import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '8xl': '96rem',
      },
      colors: {
        'webchat-blue': '#355b8e',
        'ai-blue': '#6587bc',
        'icon-blue': '#2374d3',
      },
      animation: {
        'gradient-slide': 'gradient-slide 2s ease infinite',
      },
      keyframes: {
        'gradient-slide': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 0%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
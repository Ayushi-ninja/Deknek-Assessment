import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#84ff00',
        background: '#000000',
      },
      boxShadow: {
        neon: '0 0 20px #84ff00',
        'neon-lg': '0 0 40px rgba(132,255,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config

/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: '#C4A35A',
        secondary: '#2D5A4A',
        accent: '#E85D4C',
        background: '#F5F2EB',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6B6B',
        'sand-light': '#E8DCC8',
        'sand-dark': '#B89B5D',
        'oasis': '#3D6B5A',
        'desert': '#D4A857',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'sans-serif'],
        decorative: ['Ma Shan Zheng', 'cursive'],
      },
      animation: {
        'marker-bounce': 'markerBounce 0.6s ease-out',
        'card-slide': 'cardSlide 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        markerBounce: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        cardSlide: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(196, 163, 90, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(196, 163, 90, 0.8)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'glow': '0 0 20px rgba(196, 163, 90, 0.4)',
      },
    },
  },
  plugins: [],
}

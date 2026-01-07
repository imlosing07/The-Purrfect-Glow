import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════════
      // THE PURRFECT GLOW - BRAND COLORS
      // ═══════════════════════════════════════════════════════════════
      colors: {
        brand: {
          brown: '#C18046',        // Texto principal, acentos
          'brown-dark': '#A66B35', // Hover states
          orange: '#FFB559',       // CTAs, botones activos
          yellow: '#FFD797',       // Highlights, badges
          cream: '#FFF6E6',        // Fondo principal
          'cream-dark': '#FFF0D9', // Fondo hover
        },
        pastel: {
          blue: '#BDDEFF',         // Tags: Tipo de piel, estado SHIPPED
          purple: '#F5B9EC',       // Tags: Categorías
          green: '#ABE59C',        // Disponible, DELIVERED
          pink: '#FFCAD4',         // Destacados
        },
        // Estados de orden
        status: {
          pending: '#FFD797',      // Amarillo - Pendiente
          shipped: '#BDDEFF',      // Celeste - Enviado  
          delivered: '#ABE59C',    // Verde - Entregado
        }
      },
      // ═══════════════════════════════════════════════════════════════
      // TYPOGRAPHY
      // ═══════════════════════════════════════════════════════════════
      fontFamily: {
        baloo: ['var(--font-baloo)', 'cursive'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
      // ═══════════════════════════════════════════════════════════════
      // BORDER RADIUS (Cute aesthetic)
      // ═══════════════════════════════════════════════════════════════
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // ═══════════════════════════════════════════════════════════════
      // BOX SHADOWS (Soft, cute)
      // ═══════════════════════════════════════════════════════════════
      boxShadow: {
        'soft': '0 2px 8px rgba(193, 128, 70, 0.1)',
        'soft-md': '0 4px 16px rgba(193, 128, 70, 0.12)',
        'soft-lg': '0 8px 24px rgba(193, 128, 70, 0.15)',
        'glow': '0 0 20px rgba(255, 181, 89, 0.3)',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3.25rem',
        '6xl': '4rem',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.4em',
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      'slide-in': {
        '0%': { transform: 'translateX(100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      'slide-out': {
        '0%': { transform: 'translateX(0)', opacity: '1' },
        '100%': { transform: 'translateX(100%)', opacity: '0' },
      },
      'bounce-soft': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-5px)' },
      },
    },
    animation: {
      'shimmer': 'shimmer 2s infinite',
      'slide-in': 'slide-in 0.3s ease-out',
      'slide-out': 'slide-out 0.3s ease-in',
      'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;

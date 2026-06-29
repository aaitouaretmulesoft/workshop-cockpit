/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        electric: {
          15: '#0C1A3F',
          30: '#0B2D9B',
          50: '#1B5CE6',
        },
        cloud: {
          20: '#023248',
          40: '#05628A',
          60: '#0D9DDA',
          68: '#47AADC',
          80: '#90D0FE',
          95: '#EAF5FE',
        },
        accent: {
          teal: '#00A3A3',
          yellow: '#F5C518',
          pink: '#D43FAA',
          violet: '#6B3FA0',
        },
      },
      fontFamily: {
        display: [
          'var(--font-display)',
          '"Avant Garde"',
          '"Century Gothic"',
          'Futura',
          'sans-serif',
        ],
        body: [
          'var(--font-body)',
          '"Salesforce Sans"',
          'Arial',
          'Helvetica',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          '"SF Mono"',
          '"JetBrains Mono"',
          'Menlo',
          'monospace',
        ],
      },
      borderRadius: {
        card: '8px',
        pill: '24px',
      },
      boxShadow: {
        cockpit: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 24px -12px rgba(11,45,155,0.25)',
        glow: '0 0 0 4px rgba(27,92,230,0.15)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #EAF5FE 0%, #90D0FE 35%, #1B5CE6 80%, #0B2D9B 100%)',
        'dark-hero':
          'linear-gradient(135deg, #1B5CE6 0%, #0B2D9B 60%, #0C1A3F 100%)',
        'instrument-grid':
          'linear-gradient(rgba(11,45,155,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,45,155,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
        slideUp: 'slideUp 0.45s ease-out',
      },
    },
  },
  plugins: [],
};

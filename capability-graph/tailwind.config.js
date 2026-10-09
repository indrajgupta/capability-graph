/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        bg: {
          base:    '#07090f',   // deepest background
          surface: '#0d1117',   // main surface
          raised:  '#131920',   // raised panels
          subtle:  '#1a2233',   // subtle elevation
          border:  '#1e2d40',   // default borders
        },
        // Text hierarchy
        text: {
          primary:   '#e8edf5',
          secondary: '#8b98b0',
          muted:     '#4d5c75',
          accent:    '#60a5fa',
        },
        // Node type colors — semantic, restrained
        node: {
          person:      { DEFAULT: '#818cf8', bg: '#1e1f4a', border: '#3730a3' },
          project:     { DEFAULT: '#34d399', bg: '#0d2e24', border: '#065f46' },
          skill:       { DEFAULT: '#fb923c', bg: '#2d1a0e', border: '#9a3412' },
          technology:  { DEFAULT: '#60a5fa', bg: '#0c1f3a', border: '#1d4ed8' },
          capability:  { DEFAULT: '#e879f9', bg: '#2d0f3a', border: '#86198f' },
          experience:  { DEFAULT: '#facc15', bg: '#2d2000', border: '#854d0e' },
          education:   { DEFAULT: '#2dd4bf', bg: '#0d2d2a', border: '#0f766e' },
          evidence:    { DEFAULT: '#94a3b8', bg: '#1a2133', border: '#334155' },
          certification:{ DEFAULT: '#f472b6', bg: '#2d1127', border: '#9d174d' },
        },
        // Accent
        accent: {
          blue:   '#3b82f6',
          purple: '#8b5cf6',
          cyan:   '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        panel:   '0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)',
        node:    '0 0 0 1px rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.5)',
        glow:    '0 0 20px rgba(96,165,250,0.15)',
        glow_sm: '0 0 8px rgba(96,165,250,0.2)',
      },
      animation: {
        'fade-in':      'fadeIn 0.2s ease-out',
        'slide-in-r':   'slideInRight 0.25s ease-out',
        'slide-in-up':  'slideInUp 0.2s ease-out',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':    'spin 3s linear infinite',
        'node-appear':  'nodeAppear 0.4s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        slideInUp: {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to:   { transform: 'translateY(0)',   opacity: '1' },
        },
        nodeAppear: {
          from: { transform: 'scale(0.7)', opacity: '0' },
          to:   { transform: 'scale(1)',   opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

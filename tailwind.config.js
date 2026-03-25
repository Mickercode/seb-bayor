/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-fg': 'var(--color-primary-fg)',
        accent: 'var(--color-accent)',
        surface: 'var(--bg-surface)',
        'teal': {
          DEFAULT: '#2F5D6C',
          50: '#E8F0F3',
          100: '#D1E1E6',
          200: '#A3C3CD',
          300: '#7596A2',
          400: '#527A87',
          500: '#2F5D6C',
          600: '#264B57',
          700: '#1C3841',
          800: '#13262C',
          900: '#091316',
        },
        'mint': {
          DEFAULT: '#12EDA9',
          50: '#E6FDF6',
          100: '#CCFBED',
          200: '#99F7DB',
          300: '#66F3C9',
          400: '#33EFB7',
          500: '#12EDA9',
          600: '#0EBE87',
          700: '#0B8E65',
          800: '#075F44',
          900: '#042F22',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        zone: 'var(--radius)',
      },
    },
  },
  plugins: [],
}

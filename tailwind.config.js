/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lato': ['Lato', 'sans-serif'],
      },
      colors: {
        'surface-base': 'var(--surface-base, white)',
        'text-default': 'var(--text-default, black)',
        'text-subheading': 'var(--text-subheading, #666)',
        'text-placeholder': 'var(--text-placeholder, #808080)',
        'text-success': 'var(--text-semantic-success, #479e4c)',
        'border-default': 'var(--surface-transparent-dark-10, rgba(0,0,0,0.1))',
        'magic-purple': '#8044ff',
      },
      boxShadow: {
        'card': '0px 4px 16px 0px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}

/** @type {import('tailwindcss').Config} */
export const content = [
  './index.html', // Include the HTML file(s)
  './src/**/*.{js,jsx,ts,tsx}', // Scan all JavaScript/JSX/TypeScript/TSX files in the src folder
];

export const theme = {
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
  extend: {
    colors: {
      "rabbit-red": "#ea2e0e",
    }
  },
};
export const plugins = [];

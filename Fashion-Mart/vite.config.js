import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // Use Tailwind CSS with an imported function
        autoprefixer(), // Use Autoprefixer with an imported function
      ],
    },
  },
  build: {
    assetsInlineLimit: 0, // Don't inline any assets as base64
  }
});

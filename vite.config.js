import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hair-growth-solutions/',
  build: {
    outDir: "hair-growth-solutions"
  }
})

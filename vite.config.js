import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@backend': '/backend', // This tells Vite to treat '@backend' as the path to your backend folder
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

//localhost changed to straight IP because for some reason the Playwirght didint work with localhost due to my windows and dropbox configurations
export default defineConfig({
  plugins: [react()],
  cacheDir: '.vite',
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3003',
        changeOrigin: true
      }
    }
  }
})

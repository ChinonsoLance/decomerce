import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // In production Vercel puts the storefront, the API and the admin console on
  // one domain. These proxies reproduce that locally, so a fetch to /api works
  // the same on :5173 as it does live — provided the backend is running
  // (cd server && npm start).
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
    },
  },
})

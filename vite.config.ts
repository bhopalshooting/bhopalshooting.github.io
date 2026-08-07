import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Binds to all interfaces: the app only ever runs in the devcontainer, and
  // localhost-only would not reach the host through the published port.
  server: {
    host: process.env.VITE_HOST ?? '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: process.env.VITE_HOST ?? '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
})

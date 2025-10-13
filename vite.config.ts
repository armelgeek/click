import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Click & Vape',
        short_name: 'Click & Vape',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        description: 'VapoStore - Click & Vape',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {},
    "process.env.VITE_APP_SERVER_URL": JSON.stringify(process.env.VITE_APP_SERVER_URL)
  },
  server: {
    allowedHosts: ['.clicknvape.fr'],
  },
})

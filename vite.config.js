import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Radha Jaap Reminder",
        short_name: "Jaap",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ff6600",
        icons: [
          {
            src: "/icon.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      }
    })
  ]
})
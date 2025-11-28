// endikaaryandhi/bountyboard/BountyBoard-d5db89b60de7f1db5a07c8e05176e7b70460f280/bounty-board/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Bounty Board Guild',
        short_name: 'BountyBoard',
        description: 'Official Guild Bounty Tracking System',
        theme_color: '#2e2622', // Sesuai warna background di index.css
        background_color: '#2e2622',
        display: 'standalone', // Ini yang membuat tampilan seperti aplikasi native (tanpa address bar browser)
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' 
          }
        ]
      }
    })
  ],
})
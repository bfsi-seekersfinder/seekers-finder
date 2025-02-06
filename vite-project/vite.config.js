import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server:{
    proxy:{
      '/api':{
        target:'localhost:4000',
        changeOrigin:true
      },
      
    },
    allowedHosts :["2100-183-83-53-178.ngrok-free.app",]
}})

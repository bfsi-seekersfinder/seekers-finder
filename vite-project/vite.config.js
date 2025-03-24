import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server:{
    host: true,
    port: 5173,  
    strictPort: true,  
    cors: true,
    proxy:{
      '/api':{
        target:'https://seekers-finder-server.onrender.com',
        changeOrigin:true,
        secure:false
      },
    },
  }})

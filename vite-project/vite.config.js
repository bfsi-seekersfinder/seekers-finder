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
        target:'http://localhost:4000',
        changeOrigin:true,
        secure:false
      },
    },
  }})

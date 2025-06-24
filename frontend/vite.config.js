import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server:{
  //   proxy:{
  //     '/api':{
  //       target:'https://real-estate-production-0285.up.railway.app/',
  //       secure:false
  //   }
  // },
  },
  plugins: [react(),  tailwindcss()],
})

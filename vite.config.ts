import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // Позволяет серверу слушать все IP-адреса
    port: 5173 // Укажите нужный порт (по умолчанию 5173)
  }
})

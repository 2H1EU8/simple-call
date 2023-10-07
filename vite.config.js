import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}},
  resolve: {
    alias: {
      "readable-stream": "vite-compatible-readable-stream"
    },
  },
})

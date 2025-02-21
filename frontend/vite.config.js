import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Change build paths to make them Maven compatible
  build: {
    outDir: 'target/dist',
    assetsDir: 'static',
  },
  // Utile uniquement quand oon utilise le serveur de développement node
  server: {
    proxy: { // On redirige toutes les requêtes au backend vers le serveur de développement java
      '/api': { // L'API REST autogénérée, correspond à la config du backend spring.data.rest.base-path dans application.properties
        target: 'http://localhost:8989', // correspond à la config du backend server.port dans application.properties
        changeOrigin: true,
      },
    },
  },
})

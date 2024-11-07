import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {VueAmapResolver} from '@vuemap/unplugin-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    AutoImport({
      resolvers: [VueAmapResolver()],
    }),
    Components({
      resolvers: [VueAmapResolver()],
    }),
  ], 
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
  // server: { 
  //   host: true,
  //   open: true,
  //   proxy: {
  //     '/hotel': {
  //       target: 'http://localhost:5271/',
  //       changeOrigin: true,//是否跨域
  //       rewrite: (p) => p.replace(/^\/hotel/, '')//重写路径
  //     }
  //   }
  // },
})

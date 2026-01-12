import { defineConfig } from 'vite'
import { resolve } from 'path'

// Build configuration for reactive-store framework (IIFE - works with file:// protocol)
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.vanilla.ts'),
      name: 'ReactiveStore',
      fileName: () => 'reactive-store.iife.js',
      formats: ['iife'] // IIFE format works with file:// protocol
    },
    rollupOptions: {
      // No external dependencies - everything bundled
    },
    minify: false,
    sourcemap: false,
      outDir: 'dist'
  }
})

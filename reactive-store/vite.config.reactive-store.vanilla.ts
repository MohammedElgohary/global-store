import { defineConfig } from 'vite'
import { resolve } from 'path'

// Build configuration for reactive-store framework (vanilla JS only, no React)
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.vanilla.ts'),
      name: 'ReactiveStore',
      fileName: () => 'reactive-store.js',
      formats: ['es']
    },
    rollupOptions: {
      // No external dependencies - everything bundled
    },
    minify: false,
    sourcemap: true,
      outDir: 'dist'
  }
})

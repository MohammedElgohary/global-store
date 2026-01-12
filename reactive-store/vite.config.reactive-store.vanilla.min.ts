import { defineConfig } from 'vite'
import { resolve } from 'path'

// Build configuration for reactive-store framework (vanilla JS only, minified)
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.vanilla.ts'),
      name: 'ReactiveStore',
      fileName: () => 'reactive-store.min.js',
      formats: ['es']
    },
    rollupOptions: {
      // No external dependencies - everything bundled
    },
    minify: 'esbuild',
    sourcemap: false,
      outDir: 'dist',
    emptyOutDir: false
  }
})

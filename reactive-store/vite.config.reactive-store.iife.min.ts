import { defineConfig } from 'vite'
import { resolve } from 'path'

// Build configuration for reactive-store framework (IIFE minified - works with file:// protocol)
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.vanilla.ts'),
      name: 'ReactiveStore',
      fileName: () => 'reactive-store.iife.min.js',
      formats: ['iife'] // IIFE format works with file:// protocol
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

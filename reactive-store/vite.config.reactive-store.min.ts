import { defineConfig } from 'vite'
import { resolve } from 'path'

// Build configuration for reactive-store framework (minified)
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactiveStore',
      fileName: () => 'reactive-store.min.js',
      formats: ['es']
    },
    rollupOptions: {
      // Externalize React if needed (for React hooks)
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    minify: 'esbuild', // Minify with esbuild (built into Vite)
    sourcemap: false,
      outDir: 'dist',
    emptyOutDir: false // Don't delete the uncompressed file
  }
})

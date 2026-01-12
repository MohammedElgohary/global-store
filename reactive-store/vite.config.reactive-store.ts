import { defineConfig } from 'vite'
import { resolve } from 'path'

// Build configuration for reactive-store framework
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactiveStore',
      fileName: () => 'reactive-store.js',
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
    minify: false, // We'll create separate minified build
    sourcemap: true,
      outDir: 'dist'
  }
})

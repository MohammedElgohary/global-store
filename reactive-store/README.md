# Reactive Store Framework

A lightweight, framework-agnostic reactive state management system.

## 📁 Structure

```
reactive-store/
├── src/              # Source code
│   ├── core/         # Core reactive system
│   ├── react/        # React hooks integration
│   ├── types/        # TypeScript types
│   └── examples/     # Example applications
├── dist/             # Built files
├── examples/         # Standalone examples
└── vite.config.*.ts  # Build configurations
```

## 🚀 Quick Start

### Build

```bash
# Build vanilla version (no React)
npm run build:reactive-store

# Build with React hooks
npm run build:reactive-store:dev

# Build IIFE version (works with file://)
npm run build:reactive-store:iife
```

### Use

```html
<!-- ES Module (requires server) -->
<script type="module">
  import { reactive, bindText } from "./dist/reactive-store.min.js";
</script>

<!-- IIFE (works with file://) -->
<script src="./dist/reactive-store.iife.min.js"></script>
<script>
  const { reactive, bindText } = ReactiveStore;
</script>
```

## 📚 Documentation

See `src/README.md` for complete documentation.

## 📦 Build Outputs

- `dist/reactive-store.js` - Uncompressed ES module
- `dist/reactive-store.min.js` - Minified ES module
- `dist/reactive-store.iife.min.js` - Minified IIFE (works with file://)

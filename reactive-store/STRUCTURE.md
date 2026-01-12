# Reactive Store Framework - Directory Structure

All framework-related files have been moved to the `reactive-store/` directory.

## 📁 Directory Structure

```
reactive-store/
├── src/                          # Source code
│   ├── core/                     # Core reactive system
│   │   ├── reactive.ts           # Reactive primitives and objects
│   │   ├── computed.ts           # Computed values
│   │   ├── effect.ts             # Effects
│   │   ├── batch.ts              # Batch updates
│   │   ├── bind.ts               # DOM binding functions
│   │   ├── readonly.ts           # Readonly reactive
│   │   ├── watch.ts              # Watch functions
│   │   ├── debug.ts              # Debug tools
│   │   ├── utils.ts              # Utilities
│   │   ├── dependency.ts         # Dependency tracking
│   │   └── index.ts              # Core exports
│   ├── react/                    # React integration
│   │   ├── hooks/                # React hooks
│   │   │   ├── useReactive.ts
│   │   │   ├── useComputed.ts
│   │   │   ├── useReactiveObject.ts
│   │   │   └── useWatch.ts
│   │   └── index.ts
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   ├── examples/                 # Example applications
│   │   ├── counter.html
│   │   ├── form-validation.html
│   │   ├── todo-list.html
│   │   ├── shopping-cart.html
│   │   └── ...
│   ├── index.ts                  # Main entry (with React hooks)
│   ├── index.vanilla.ts          # Vanilla JS entry (no React)
│   └── *.md                      # Documentation files
├── dist/                         # Built files
│   ├── reactive-store.js          # Uncompressed ES module
│   ├── reactive-store.min.js     # Minified ES module
│   ├── reactive-store.iife.js    # Uncompressed IIFE
│   └── reactive-store.iife.min.js # Minified IIFE
├── examples/                     # Standalone examples
│   └── counter.html              # Example using IIFE build
├── vite.config.reactive-store.ts      # Build config (with React)
├── vite.config.reactive-store.min.ts  # Build config (minified, with React)
├── vite.config.reactive-store.vanilla.ts # Build config (vanilla)
├── vite.config.reactive-store.vanilla.min.ts # Build config (vanilla, minified)
├── vite.config.reactive-store.iife.ts # Build config (IIFE)
├── vite.config.reactive-store.iife.min.ts # Build config (IIFE, minified)
├── README.md                     # Quick start guide
└── STRUCTURE.md                  # This file
```

## 🔧 Build Commands

All build commands are in `package.json`:

```bash
# Build vanilla version (default, no React)
npm run build:reactive-store

# Build with React hooks
npm run build:reactive-store:dev
npm run build:reactive-store:min

# Build IIFE version (works with file://)
npm run build:reactive-store:iife
```

## 📦 Output Files

All built files are in `reactive-store/dist/`:

- **ES Modules** (require HTTP server):
  - `reactive-store.js` - Uncompressed
  - `reactive-store.min.js` - Minified

- **IIFE** (works with `file://`):
  - `reactive-store.iife.js` - Uncompressed
  - `reactive-store.iife.min.js` - Minified

## 🚀 Usage

### ES Module (requires server)
```html
<script type="module">
  import { reactive, bindText } from './reactive-store/dist/reactive-store.min.js';
</script>
```

### IIFE (works with file://)
```html
<script src="./reactive-store/dist/reactive-store.iife.min.js"></script>
<script>
  const { reactive, bindText } = ReactiveStore;
</script>
```

## 📝 Notes

- All source code is in `reactive-store/src/`
- All build configs are in `reactive-store/`
- All built files are in `reactive-store/dist/`
- Examples are in both `reactive-store/src/examples/` and `reactive-store/examples/`

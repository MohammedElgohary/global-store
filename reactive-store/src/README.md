# 🧠 Reactive Store Framework

A lightweight, framework-agnostic reactive state management system that works in vanilla JavaScript without React or any other framework.

## ✨ Features

- ✅ **Reactive Primitives** - Make any value reactive
- ✅ **Computed Values** - Automatically derived reactive values
- ✅ **Effects** - Run side effects when data changes
- ✅ **Reactive Objects** - Deep reactivity for objects using Proxy
- ✅ **DOM Binding** - Automatically update DOM without manual manipulation
- ✅ **Batch Updates** - Prevent intermediate notifications
- ✅ **TypeScript Support** - Full type safety
- ✅ **Zero Dependencies** - No external libraries required
- ✅ **Framework Agnostic** - Works in vanilla JS, React, Vue, or anywhere

## 🚀 Quick Start

### Installation

The framework is already in your project. Just import it:

```typescript
import { reactive, effect } from "./reactive-store/src";
```

### Basic Usage

```typescript
import { reactive, effect } from "./reactive-store/src";

// Create reactive state
const count = reactive(0);

// Automatically update when count changes
effect(() => {
  console.log("Count:", count.value);
});

// Change the value - effect runs automatically!
count.value = 5; // Logs: "Count: 5"
```

## 📚 API Reference

### `reactive<T>(initialValue: T): Reactive<T>`

Creates a reactive primitive value.

```typescript
const count = reactive(0);
count.value = 10; // Automatically notifies subscribers
count.subscribe(() => console.log("Changed!"));
```

### `computed<T>(fn: () => T): Computed<T>`

Creates a computed value that automatically updates when dependencies change.

```typescript
const a = reactive(1);
const b = reactive(2);

const sum = computed(() => a.value + b.value);
console.log(sum.value); // 3

a.value = 5;
console.log(sum.value); // 7 (automatically updated!)
```

### `effect(fn: () => void | (() => void)): () => void`

Runs a function and re-runs it when dependencies change.

```typescript
const count = reactive(0);

const stop = effect(() => {
  console.log("Count:", count.value);
  // Optional cleanup function
  return () => {
    console.log("Effect cleaned up");
  };
});

// Later...
stop(); // Stop the effect
```

### `reactive<T>(obj: T): T` (for objects)

When you pass an object to `reactive()`, it automatically uses Proxy for direct property access.

```typescript
const user = reactive({
  name: "John",
  age: 30,
  address: {
    city: "NYC",
  },
});

effect(() => {
  console.log(user.name, user.age, user.address.city);
});

user.name = "Jane"; // Triggers effect
user.age = 31; // Triggers effect
user.address.city = "LA"; // Triggers effect (deep reactivity)
```

### `batch(fn: () => void): void`

Batches multiple updates into a single notification.

```typescript
const user = reactive({
  name: "John",
  age: 30,
  email: "john@example.com",
});

effect(() => {
  console.log("User updated");
});

// Without batch: effect runs 3 times
user.name = "Jane";
user.age = 31;
user.email = "jane@example.com";

// With batch: effect runs once
batch(() => {
  user.name = "Jane";
  user.age = 31;
  user.email = "jane@example.com";
});
```

### DOM Binding Functions

Automatically update the DOM when reactive values change - **no manual DOM manipulation needed!**

```typescript
import {
  reactive,
  bindText,
  bindHTML,
  bindAttr,
  render,
} from "./reactive-store/src";

const count = reactive(0);
const user = reactive({ name: "John" });

// Bind text content
bindText("#counter", count);

// Bind HTML
bindHTML("#content", () => `<div>${user.name}</div>`);

// Bind attributes
bindAttr("#input", "value", () => user.name);
bindAttr("#button", "disabled", () => count.value === 0);

// Render templates
render("#todo-list", () => {
  return todos.map((todo) => `<div>${todo.text}</div>`).join("");
});
```

**Available bindings:**

- `bindText()` - Update text content
- `bindHTML()` - Update HTML content
- `bindAttr()` - Update attributes
- `bindProp()` - Update properties
- `bindClass()` - Toggle CSS classes
- `bindStyle()` - Update CSS styles
- `render()` - Render templates
- `bindMultiple()` - Bind multiple at once

See `DOM_BINDING.md` for complete documentation.

## 🎯 Examples

See the `examples/` directory for complete working examples:

- **counter.html** - Simple counter with reactive state
- **form-validation.html** - Form with real-time validation
- **todo-list.html** - Full todo list application
- **shopping-cart.html** - Shopping cart with computed totals
- **simple-example.html** - Basic reactive example
- **dom-binding-demo.html** - Complete DOM binding demonstration
- **advanced-features.html** - Advanced features demo

All examples use the new **DOM binding system** - no manual `document.getElementById()` needed!

## 🏗️ Architecture

```
reactive-store/src/
├── core/              # Core reactive system
│   ├── reactive.ts       # Reactive (unified for primitives and objects)
│   ├── computed.ts       # Computed values
│   ├── effect.ts         # Effects
│   ├── batch.ts          # Batch updates
│   ├── bind.ts           # DOM binding functions
│   └── dependency.ts     # Dependency tracking
├── types/             # TypeScript types
│   └── index.ts
├── react/             # React integration
│   └── hooks/         # React hooks
├── examples/          # Example applications
├── draft/             # Development/planning documents
├── index.ts          # Main export (with React hooks)
└── index.vanilla.ts   # Vanilla JS export (no React)
```

## 🔧 How It Works

### Dependency Tracking

When you access a reactive value inside an effect or computed:

1. The system records that this effect/computed depends on that value
2. When the value changes, it automatically re-runs the effect or recomputes

### Notification System

1. When a reactive value changes, it notifies all subscribers
2. Subscribers can be effects, computed values, or manual subscriptions
3. Updates can be batched to prevent intermediate notifications

### Proxy for Objects

JavaScript Proxy intercepts property access and changes:

- `get`: Track which properties are accessed (for dependency tracking)
- `set`: Notify subscribers when properties change

## 💡 Use Cases

- **Form Validation** - Real-time validation as user types
- **Shopping Carts** - Automatic price calculations
- **Dashboards** - Auto-updating statistics
- **Games** - Reactive game state
- **Data Visualization** - Charts that update automatically
- **Live Search** - Filtering results as you type

## 📖 Documentation

- **README.md** (this file) - Main framework documentation
- **ADVANCED_FEATURES.md** - Advanced features guide
- **DOM_BINDING.md** - DOM binding guide
- **REACT_INTEGRATION.md** - React hooks guide
- **UNIFIED_API.md** - Unified API documentation
- **examples/** - Working examples with documentation

## 🚨 Important Notes

1. **ES Modules Required** - Use `type="module"` in script tags
2. **Web Server Required** - Cannot use `file://` protocol (unless using IIFE build)
3. **Modern Browser** - Requires Proxy and ES6 support
4. **TypeScript** - Written in TypeScript but works in plain JS

## 🔄 Similar Frameworks

This framework is **inspired by** and **similar to**:

- **Vue 3 Composition API** - Almost identical API (`reactive`, `computed`, `effect`)
- **Solid.js** - Similar fine-grained reactivity model
- **MobX** - Similar observable pattern
- **Svelte** - Similar reactive primitives

See `COMPARISON.md` for a detailed comparison with other reactive frameworks.

## 📝 License

Part of the global-store project.

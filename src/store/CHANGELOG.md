# 📝 Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.0] - 2025-05-01

### 🚀 Initial Stable Release

- 🎉 Introduced a **global store system** for React using TypeScript.
- ✅ Built around a `Store` class that supports:
  - Subscription-based updates.
  - Shallow equality prevention.
  - Per-key `notifyDelay` debounce.
  - Functional `setValue`.
  - Optional persistence logic with `persistGetter` / `persistSetter`.
- 💡 Added optional debugging logs for development mode.

### 🧰 Utilities

- `createStore` – Initialize a store with configuration.
- `getStoreValue` – Get the current value for a store key.
- `setStoreValue` – Set a new value for a store key.
- `batch` – Perform batched updates without triggering intermediate rerenders.
- `getOrCreateStore` – Create or fetch a singleton store instance for a key.

### 🔗 Hooks

- `useStore` – Main hook with selector, debounce, and return tuple of `[value, setValue]`.
- `useStoreValue` – Hook to read the current value for a key.
- `useStoreInstance` – Access the raw `Store` instance for a key.
- `useStoreSelector` – Read a derived value with selector logic.
- `useSetStoreValue` – Get only the setter for a key.

### 🧩 HOC

- `withStore(Component, keys)` – Wrap any component and inject:
  - `store`: the current values.
  - `storeInstances`: raw `Store` instances.
- 🧠 Now memoized to prevent unnecessary re-renders.

---

## 🔮 Planned for Next Release

- Will be updated

---

> 💡 Tip: This store system is framework-agnostic and could be extended for use in non-React contexts in the future.

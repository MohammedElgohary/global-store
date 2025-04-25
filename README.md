# 🧠 Global Store System (React + TypeScript)

A minimal, yet powerful global state management system built for React. Supports:

- ✅ Global shared state
- ✅ Controlled component re-renders
- ✅ Selector-based subscriptions
- ✅ Store-level persistence
- ✅ Debounced updates
- ✅ Batch updates
- ✅ Hook-based + HOC access

---

## 📦 Features

- **Global Reactive Store**: Stores are globally shared and reactive.
- **Custom Hooks & HOC**: Access store data via composable React hooks or HOCs.
- **Selective Subscription**: Subscribe to only part of the state using selectors.
- **Debounced Updates**: Prevents unnecessary re-renders by batching updates.
- **Persistence Support**: Easily persist specific stores to storage.
- **Type-safe**: Built with full TypeScript support.
- **No External Dependencies**.

---

## 🛠 Store Utilities

### `configureStore`

```ts
configureStore<Value>(config: Partial<Config<Value>>): void
```

Allows you change store config globally.

#### Example:

```ts
configureStore({
  name: "ElGohary Store",
  debug: true,
  notifyDelay: 0, // disable debounced updates ({ default: 20ms })
  persistOptions: {
    persistGetter(key) {
      if (!localStorage.getItem(key)) {
        return null;
      }

      return JSON.parse(localStorage.getItem(key));
    },
    persistSetter(key, newValue) {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
  },
});
```

---

### `getOrCreateStore`

```ts
getOrCreateStore<Value>(options: StoreProps<Value>): Store<Value>
```

Returns an existing store instance or creates a new one.

#### Example:

```ts
const userStore = getOrCreateStore({ key: "user", defaultValue: null });
```

---

### `createStore`

```ts
createStore<Value>(options: StoreProps<Value>): Store<Value>
```

Always creates a new `Store` instance and overwrites the existing one.

---

### `getStoreValue`

```ts
getStoreValue<Value>(key: string): Value
```

Returns the current value from the store by key.

---

### `setStoreValue`

```ts
setStoreValue<Value>(key: string, value: Value | ((prev: Value) => Value)): void
```

Sets a new value into the store.

---

### `batch`

```ts
batch(fn: () => void): void
```

Batch multiple store updates to prevent intermediate re-renders.

#### Example:

```ts
batch(() => {
  setStoreValue("user", { name: "Alice" });
  setStoreValue("count", (previous) => previous + 1);
});
```

---

## 🔗 React Hooks

### `useStore`

```ts
useStore({ key, defaultValue?, selector?, persistOptions?, notifyDelay? }): [Selected, setValue]
```

- Subscribe to a store and get the selected value
- Optional `selector` to select a slice of the state
- Returns `[value, setValue]`

#### Example:

```tsx
const [user, setUser] = useStore({ key: "user" });
```

---

### `useStoreValue`

```ts
useStoreValue({ key, selector?, defaultValue? }): Selected
```

Only returns the current selected value from the store.

---

### `useStoreSelector`

```ts
useStoreSelector({ key, selector }): Selected
```

Alias to `useStoreValue` with a required `selector`.

---

### `useStoreInstance`

```ts
useStoreInstance(key: string): Store<Value>
```

Access the raw `Store` instance to call methods directly.

---

### `useSetStoreValue`

```ts
useSetStoreValue(key: string): (value: Value | (prev: Value) => Value) => void
```

Returns a setter function for the specified store.

---

## 🧱 HOC

### `withStore`

```ts
withStore(Component, keys): HOC
```

Injects `store` values and `storeInstances` into the wrapped component as props.

#### Example:

```tsx
export default withStore(MyComponent, ["user", "count"]);
```

Inside `MyComponent`:

```tsx
function MyComponent({ store: { user, count }, storeInstances }) {
  console.log(user); // access user value

  storeInstances.count.value = 10;
  storeInstances.count.value = (previous) => previous + 1;

  console.log(storeInstances.count.value); // access count store instance value  which is ({ 11 }) for now

  return <>...</>;
}
```

---

## 🧠 Store Class

### `Store<Value>`

Each store is an instance of `Store<Value>` with the following methods and properties:

- `value`: getter/setter for the store's current value
- `subscribe(callback)`: subscribe to value changes
- `key`: unique identifier
- `defaultValue`: fallback value
- `notifyDelay`: debounce delay for notifying subscribers
- `persistOptions`: optional config for persistence

---

## 💾 Persistence

You can persist a store's value via the `persistOptions` prop:

```ts
{
  persistGetter: (key) => localStorage.getItem(key),
  persistSetter: (key, newValue) => localStorage.setItem(key, JSON.stringify(newValue))
}
```

---

## ⏱ Debounced Notifications

Use `notifyDelay` to debounce updates (default: `20ms`):

```ts
getOrCreateStore({
  key: "settings",
  notifyDelay: 100,
});
```

This reduces unnecessary renders from rapid updates.

---

## 🧪 Example Usage

```tsx
const [count, setCount] = useStore({ key: "counter", defaultValue: 0 });

return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
```

---

## 🧪 Testable Architecture

Since stores are separated from React, you can test logic independently:

```ts
const store = getOrCreateStore({ key: "user", defaultValue: null });
store.subscribe(() => console.log("User changed:", store.value));
store.value = { name: "Alice" };
```

---

## 📁 File Structure

```
src/store/
│
├── @types/
│   └── index.d.ts
│
├── config/                  # Global config (name, debug, delay)
│   └── index.ts
│
├── functions/
│   ├── getOrCreateStore.ts
│   ├── configureStore.ts
│   ├── createStore.ts
│   ├── setStoreValue.ts
│   ├── getStoreValue.ts
│   └── batch.ts
│
├── hooks/
│   ├── useStore.ts
│   ├── useStoreValue.ts
│   ├── useStoreSelector.ts
│   ├── useSetStoreValue.ts
│   └── useStoreInstance.ts
│
├── HOC/
│   └── withStore.ts
│
├── @types/
│   └── index.d.ts
│
├── StoreClass.ts            # Store<Value> class
│
└──  storeRegistry.ts        # Global registry and flags
```

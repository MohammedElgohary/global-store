# ⚛️ React Integration

The reactive store framework now includes React hooks for seamless integration with React components!

## 🎯 React Hooks

### `useReactive<T>(initialValue): [Reactive<T>, setValue]`

Create a reactive value in a React component.

```tsx
import { useReactive } from './reactive-store/src';

function Counter() {
  const [count, setCount] = useReactive(0);

  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={() => setCount(count.value + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
    </div>
  );
}
```

### `useComputed<T>(fn, deps?): Computed<T>`

Create a computed value in a React component.

```tsx
import { useReactive, useComputed } from './reactive-store/src';

function UserProfile() {
  const [firstName, setFirstName] = useReactive('John');
  const [lastName, setLastName] = useReactive('Doe');

  const fullName = useComputed(() => {
    return `${firstName.value} ${lastName.value}`;
  });

  return (
    <div>
      <p>Full Name: {fullName.value}</p>
      <input 
        value={firstName.value} 
        onChange={(e) => setFirstName(e.target.value)} 
      />
      <input 
        value={lastName.value} 
        onChange={(e) => setLastName(e.target.value)} 
      />
    </div>
  );
}
```

### `useReactiveObject<T>(initialValue): [T, update]`

Create a reactive object in a React component.

```tsx
import { useReactiveObject } from './reactive-store/src';

function UserForm() {
  const [user, updateUser] = useReactiveObject({
    name: 'John',
    age: 30,
    email: 'john@example.com'
  });

  return (
    <div>
      <input 
        value={user.name} 
        onChange={(e) => updateUser({ name: e.target.value })} 
      />
      <input 
        type="number"
        value={user.age} 
        onChange={(e) => updateUser({ age: Number(e.target.value) })} 
      />
      <p>Name: {user.name}, Age: {user.age}</p>
    </div>
  );
}
```

### `useWatch<T>(source, callback, options?)`

Watch a reactive value and run a callback when it changes.

```tsx
import { useReactive, useWatch } from './reactive-store/src';

function NotificationComponent() {
  const [count, setCount] = useReactive(0);

  useWatch(count, (newValue, oldValue) => {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
    // Show notification, send analytics, etc.
  });

  return (
    <div>
      <p>Count: {count.value}</p>
      <button onClick={() => setCount(count.value + 1)}>Increment</button>
    </div>
  );
}
```

## 🔄 Comparison: New Store vs Existing Store

### Existing Store (React-focused)
```tsx
import { useStore } from './store';

function Component() {
  const [user, setUser] = useStore({
    key: 'user',
    defaultValue: { name: 'John' }
  });

  return <div>{user.name}</div>;
}
```

### New Reactive Store (Framework-agnostic + React hooks)
```tsx
import { useReactiveObject } from './reactive-store/src';

function Component() {
  const [user, updateUser] = useReactiveObject({ name: 'John' });

  return <div>{user.name}</div>;
}
```

## 💡 When to Use Which

### Use Existing Store when:
- ✅ You need global shared state across components
- ✅ You need persistence (localStorage, etc.)
- ✅ You need debounced updates
- ✅ You're building a React-only app

### Use New Reactive Store when:
- ✅ You want framework-agnostic code
- ✅ You need computed values
- ✅ You want to use it in vanilla JS
- ✅ You need more fine-grained reactivity
- ✅ You want to share code between React and non-React code

## 🎨 Using Both Together

You can use both systems together:

```tsx
import { useStore } from './store';
import { useReactive, effect } from './reactive-store/src';

function HybridComponent() {
  // Existing store for global state
  const [globalUser, setGlobalUser] = useStore({
    key: 'user',
    defaultValue: null
  });

  // New reactive store for local state
  const [localCount, setLocalCount] = useReactive(0);

  // Sync them together
  effect(() => {
    if (globalUser) {
      console.log('Global user changed:', globalUser);
    }
  });

  return (
    <div>
      <p>Global: {globalUser?.name}</p>
      <p>Local Count: {localCount.value}</p>
    </div>
  );
}
```

## 🚀 Benefits

1. **Framework Agnostic** - Works in React, Vue, vanilla JS, anywhere
2. **Computed Values** - Automatic derived state
3. **Better Performance** - Fine-grained reactivity
4. **Type Safety** - Full TypeScript support
5. **Debug Tools** - Built-in debugging utilities

## 📚 Examples

See the examples directory for complete working examples:
- `counter.html` - Basic reactive example
- `form-validation.html` - Form with validation
- `todo-list.html` - Full todo app

For React examples, you can use the hooks in any React component!

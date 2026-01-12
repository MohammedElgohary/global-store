# 🎯 Reactive Data Concept - Simple Explanation

## The Problem

In normal JavaScript, when you change a variable, nothing happens automatically:

```javascript
let count = 0;
count = 5; // ❌ No one knows it changed!
```

You have to manually notify anyone who cares:

```javascript
let count = 0;
let listeners = [];

function setCount(newValue) {
  count = newValue;
  listeners.forEach(fn => fn(newValue)); // Manual notification
}
```

## The Solution: Reactive Wrappers

Wrap values in a **reactive container** that automatically notifies subscribers:

```typescript
const count = reactive(0);

// Subscribe to changes
count.subscribe((newValue) => {
  console.log("Count changed to:", newValue);
});

count.value = 5; // ✅ Automatically notifies subscribers!
```

## 🧠 How It Works Internally

### Step 1: Create Reactive Value
```typescript
function reactive<T>(initialValue: T) {
  // Store the value
  let value = initialValue;
  
  // Keep track of who's watching
  const subscribers = new Set<() => void>();
  
  return {
    get value() {
      return value;
    },
    
    set value(newValue: T) {
      if (value !== newValue) {
        value = newValue;
        // Notify everyone!
        subscribers.forEach(callback => callback());
      }
    },
    
    subscribe(callback: () => void) {
      subscribers.add(callback);
      return () => subscribers.delete(callback); // Unsubscribe
    }
  };
}
```

### Step 2: Use It
```typescript
const count = reactive(0);

count.subscribe(() => {
  console.log("New value:", count.value);
});

count.value = 10; // Logs: "New value: 10"
count.value = 20; // Logs: "New value: 20"
```

## 🔗 Making Connections: Computed Values

When one value depends on another, make it **automatically update**:

```typescript
const firstName = reactive("John");
const lastName = reactive("Doe");

// This automatically updates when firstName or lastName changes!
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});

console.log(fullName.value); // "John Doe"

firstName.value = "Jane";
console.log(fullName.value); // "Jane Doe" (automatically updated!)
```

### How Computed Works:

1. **Track dependencies**: When `fullName` is accessed, it runs the function
2. **Detect reads**: When the function reads `firstName.value`, we record that dependency
3. **Recompute on change**: When `firstName` changes, automatically recompute `fullName`

```typescript
function computed<T>(fn: () => T) {
  let value: T;
  let isDirty = true;
  const subscribers = new Set();
  
  // Track which reactive values we depend on
  const dependencies = new Set();
  
  function recompute() {
    // Clear old dependencies
    dependencies.forEach(dep => dep.unsubscribe(recompute));
    dependencies.clear();
    
    // Run function and track new dependencies
    value = fn(); // This will trigger dependency tracking
    isDirty = false;
    
    // Notify subscribers
    subscribers.forEach(cb => cb());
  }
  
  return {
    get value() {
      if (isDirty) {
        recompute();
      }
      return value;
    },
    subscribe(callback: () => void) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    }
  };
}
```

## ⚡ Running Side Effects: Effects

Run code automatically when reactive values change:

```typescript
const count = reactive(0);

// This runs automatically whenever count changes
effect(() => {
  console.log("Count is now:", count.value);
});

count.value = 5; // Logs: "Count is now: 5"
count.value = 10; // Logs: "Count is now: 10"
```

### How Effect Works:

1. **Run the function**: Execute the effect function
2. **Track dependencies**: Record which reactive values were accessed
3. **Re-run on change**: When any dependency changes, run the function again

```typescript
let activeEffect: (() => void) | null = null;

function effect(fn: () => void) {
  const effectFn = () => {
    activeEffect = effectFn;
    fn(); // This will trigger dependency tracking
    activeEffect = null;
  };
  
  effectFn(); // Run immediately
  
  // Return cleanup function
  return () => {
    // Unsubscribe from all dependencies
  };
}
```

## 🎨 Reactive Objects

Make entire objects reactive using JavaScript Proxy:

```typescript
const user = reactive({
  name: "John",
  age: 30
});

effect(() => {
  console.log(user.name, user.age);
});

user.name = "Jane"; // ✅ Automatically triggers effect!
user.age = 31;      // ✅ Automatically triggers effect!
```

### How Reactive Objects Work:

```typescript
function reactiveObject<T extends object>(obj: T): T {
  const subscribers = new Map<string | symbol, Set<() => void>>();
  
  return new Proxy(obj, {
    get(target, key) {
      // Track dependency if inside an effect/computed
      if (activeEffect) {
        if (!subscribers.has(key)) {
          subscribers.set(key, new Set());
        }
        subscribers.get(key)!.add(activeEffect);
      }
      return target[key];
    },
    
    set(target, key, value) {
      if (target[key] !== value) {
        target[key] = value;
        // Notify subscribers of this property
        subscribers.get(key)?.forEach(cb => cb());
      }
      return true;
    }
  });
}
```

## 🔄 Connection to Your Existing Store

Your current `Store` class already has `subscribe()`! We can use it:

```typescript
function reactive<T>(initialValue: T) {
  // Use your existing Store internally!
  const store = getOrCreateStore({
    key: `reactive_${Math.random()}`,
    defaultValue: initialValue
  });
  
  return {
    get value() {
      return store.value;
    },
    set value(newValue: T) {
      store.value = newValue;
    },
    subscribe(callback: () => void) {
      return store.subscribe(callback);
    }
  };
}
```

## 📊 The Big Picture

```
┌─────────────────────────────────────────────────┐
│           Reactive System                       │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐      ┌──────────┐                │
│  │ reactive │      │ reactive │                │
│  │ (count)  │      │  (name)  │                │
│  └────┬─────┘      └────┬─────┘                │
│       │                 │                        │
│       │                 │                        │
│       └────────┬────────┘                        │
│                │                                  │
│                ▼                                  │
│         ┌──────────┐                             │
│         │ computed │                             │
│         │(display) │                             │
│         └────┬─────┘                             │
│              │                                   │
│              ▼                                   │
│         ┌──────────┐                             │
│         │  effect  │                             │
│         │ (render) │                             │
│         └──────────┘                             │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 🎯 Key Insight

**Reactivity = Automatic Dependency Tracking + Automatic Updates**

1. **Track** what depends on what
2. **Notify** when dependencies change
3. **Update** dependents automatically

This is exactly what React does internally, but we're making it available for vanilla JavaScript!

# 🧠 Reactive Store System Design - Vanilla JavaScript

## 💡 Core Concept

The current `Store` class already has reactive capabilities via `subscribe()`, but it's designed primarily for React. We need to create a **reactive primitive system** that works in vanilla JavaScript files without React dependencies.

## 🎯 Key Ideas

### 1. **Reactive Values (Observables)**

Transform regular values into reactive ones that automatically notify subscribers when changed.

```typescript
// Instead of:
const count = 0;
count = 1; // No one knows it changed

// We want:
const count = reactive(0);
count.value = 1; // Automatically notifies all subscribers
```

### 2. **Computed Values (Derived)**

Create values that automatically update when their dependencies change.

```typescript
const firstName = reactive("John");
const lastName = reactive("Doe");

// Automatically updates when firstName or lastName changes
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

### 3. **Effects (Side Effects)**

Run code automatically when reactive values change.

```typescript
const count = reactive(0);

// Automatically runs when count changes
effect(() => {
  console.log(`Count is now: ${count.value}`);
});
```

### 4. **Reactive Objects**

Make entire objects reactive, tracking nested property changes.

```typescript
const user = reactive({
  name: "John",
  age: 30,
  address: {
    city: "NYC",
  },
});

// Automatically tracks changes to nested properties
user.address.city = "LA"; // Triggers subscribers
```

## 🏗️ Architecture

### Core Components:

1. **`Reactive<T>`** - Wrapper class for reactive primitives
2. **`Computed<T>`** - Derived reactive value
3. **`Effect`** - Side effect runner
4. **`ReactiveObject<T>`** - Proxy-based reactive object

### How It Works:

```
┌─────────────────┐
│  Reactive Value │
│   (count = 5)   │
└────────┬────────┘
         │
         │ subscribes
         ▼
┌─────────────────┐
│  Subscriber Set │
│  (callbacks)    │
└────────┬────────┘
         │
         │ notifies
         ▼
┌─────────────────┐     ┌─────────────────┐
│   Computed      │     │     Effect       │
│  (derived)      │     │  (side effect)   │
└─────────────────┘     └─────────────────┘
```

## 📝 Implementation Strategy

### Option 1: Build on Existing Store (Recommended)

- Reuse the `Store` class subscription mechanism
- Create reactive wrappers that use `Store` internally
- Benefits: Less code, proven subscription system

### Option 2: Independent Reactive System

- Create new reactive primitives from scratch
- Use Proxy for object reactivity
- Benefits: More control, can optimize for vanilla JS

### Option 3: Hybrid Approach (Best)

- Use `Store` for primitive values
- Use Proxy for object reactivity
- Create computed/effect system on top

## 🔧 API Design

### Reactive Primitive

```typescript
const count = reactive(0);
count.value = 10; // Set
console.log(count.value); // Get
count.subscribe((newValue) => {
  console.log("Changed:", newValue);
});
```

### Computed

```typescript
const a = reactive(1);
const b = reactive(2);

const sum = computed(() => a.value + b.value);
console.log(sum.value); // 3

a.value = 5;
console.log(sum.value); // 7 (automatically updated)
```

### Effect

```typescript
const count = reactive(0);

const stop = effect(() => {
  console.log("Count:", count.value);
  // Cleanup function (optional)
  return () => {
    console.log("Effect cleaned up");
  };
});

// Later...
stop(); // Stop the effect
```

### Reactive Object

```typescript
const user = reactive({
  name: "John",
  age: 30,
});

effect(() => {
  console.log(`User: ${user.name}, Age: ${user.age}`);
});

user.name = "Jane"; // Triggers effect
user.age = 31; // Triggers effect
```

## 🎨 Advanced Features

### 1. **Dependency Tracking**

Automatically track which reactive values an effect/computed depends on.

### 2. **Batching Updates**

Batch multiple updates to prevent intermediate notifications.

```typescript
batch(() => {
  user.name = "John";
  user.age = 30;
  user.email = "john@example.com";
}); // Only one notification at the end
```

### 3. **Selective Subscriptions**

Subscribe to specific properties of reactive objects.

```typescript
const user = reactive({ name: "John", age: 30 });

// Only subscribe to name changes
watch(
  () => user.name,
  (newName) => {
    console.log("Name changed:", newName);
  }
);
```

### 4. **Readonly Reactive**

Create read-only reactive values.

```typescript
const readonlyCount = readonly(reactive(0));
readonlyCount.value = 10; // Error or silent fail
```

## 🔄 Integration with Existing Store

The new reactive system can:

1. **Use existing Store internally** - Wrap Store instances
2. **Coexist with Store** - Both can work together
3. **Replace Store** - If we want a complete rewrite (not recommended)

## 📊 Comparison

| Feature             | Current Store | New Reactive System |
| ------------------- | ------------- | ------------------- |
| Subscription        | ✅            | ✅                  |
| React Integration   | ✅            | ❌ (vanilla JS)     |
| Computed Values     | ❌            | ✅                  |
| Effects             | ❌            | ✅                  |
| Object Reactivity   | ❌            | ✅                  |
| Dependency Tracking | ❌            | ✅                  |

## 🚀 Implementation Plan

### Phase 1: Core Reactive Primitive

- [ ] Create `Reactive<T>` class
- [ ] Implement subscription mechanism
- [ ] Add value getter/setter

### Phase 2: Computed Values

- [ ] Create `Computed<T>` class
- [ ] Implement dependency tracking
- [ ] Add lazy evaluation

### Phase 3: Effects

- [ ] Create `effect()` function
- [ ] Implement automatic dependency tracking
- [ ] Add cleanup support

### Phase 4: Reactive Objects

- [ ] Create `reactiveObject()` function using Proxy
- [ ] Implement deep reactivity
- [ ] Add property-level subscriptions

### Phase 5: Advanced Features

- [ ] Batch updates
- [ ] Readonly reactive
- [ ] Watch specific properties
- [ ] Debug tools

## 💭 Example Usage

```typescript
// vanilla-js-file.ts
import { reactive, computed, effect } from "./reactive-store";

// Create reactive values
const firstName = reactive("John");
const lastName = reactive("Doe");
const age = reactive(30);

// Computed value
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Effect
effect(() => {
  console.log(`${fullName.value} is ${age.value} years old`);
});

// Update values
firstName.value = "Jane"; // Logs: "Jane Doe is 30 years old"
age.value = 31; // Logs: "Jane Doe is 31 years old"

// Reactive object
const user = reactive({
  name: "John",
  profile: {
    bio: "Developer",
  },
});

effect(() => {
  console.log(user.name, user.profile.bio);
});

user.name = "Jane"; // Triggers
user.profile.bio = "Designer"; // Triggers
```

## 🤔 Questions to Consider

1. **Should we use Proxy for primitives?**

   - Pros: More intuitive API (`count++` instead of `count.value++`)
   - Cons: More complex, potential performance issues

2. **Deep vs Shallow Reactivity?**

   - Deep: Track nested objects (more overhead)
   - Shallow: Only track top-level (faster, but less convenient)

3. **Circular Dependency Handling?**

   - How to handle computed values that depend on each other?

4. **Memory Management?**

   - How to prevent memory leaks with long-lived subscriptions?

5. **Performance?**
   - Should we use WeakMap for dependency tracking?
   - Should we batch updates automatically?

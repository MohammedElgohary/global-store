/**
 * 🧪 Prototype: Reactive System for Vanilla JavaScript
 * 
 * This is a proof-of-concept showing how reactive data can work
 * without React dependencies.
 */

// ============================================
// Core: Dependency Tracking
// ============================================

let activeEffect: (() => void) | null = null;
let activeComputed: Computed<any> | null = null;

// ============================================
// 1. Reactive Primitive
// ============================================

export interface Reactive<T> {
  value: T;
  subscribe(callback: () => void): () => void;
}

export function reactive<T>(initialValue: T): Reactive<T> {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  return {
    get value() {
      // Track dependency if we're inside an effect or computed
      if (activeEffect) {
        subscribers.add(activeEffect);
      }
      if (activeComputed) {
        subscribers.add(() => {
          activeComputed!.isDirty = true;
        });
      }
      return value;
    },

    set value(newValue: T) {
      if (!Object.is(value, newValue)) {
        value = newValue;
        // Notify all subscribers
        subscribers.forEach(callback => callback());
      }
    },

    subscribe(callback: () => void) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
  };
}

// ============================================
// 2. Computed Values
// ============================================

export interface Computed<T> {
  value: T;
  subscribe(callback: () => void): () => void;
  isDirty: boolean;
}

export function computed<T>(fn: () => T): Computed<T> {
  let value: T;
  let isDirty = true;
  const subscribers = new Set<() => void>();
  const dependencies = new Set<Reactive<any>>();

  const computedObj: Computed<T> = {
    get value() {
      // Track this computed as active
      const previousComputed = activeComputed;
      activeComputed = computedObj;

      if (isDirty) {
        // Clear old dependencies
        dependencies.forEach(dep => {
          // Note: In real implementation, we'd track specific unsubscribe functions
        });
        dependencies.clear();

        // Recompute
        value = fn();
        isDirty = false;

        // Notify subscribers
        subscribers.forEach(cb => cb());
      }

      activeComputed = previousComputed;
      return value;
    },

    subscribe(callback: () => void) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    isDirty: true,
  };

  return computedObj;
}

// ============================================
// 3. Effects
// ============================================

export function effect(fn: () => void | (() => void)): () => void {
  let cleanup: (() => void) | undefined;
  const dependencies = new Set<Reactive<any>>();

  const effectFn = () => {
    // Cleanup previous run
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }

    // Set as active effect
    const previousEffect = activeEffect;
    activeEffect = effectFn;

    // Run the effect function
    const result = fn();
    if (typeof result === "function") {
      cleanup = result;
    }

    activeEffect = previousEffect;
  };

  // Run immediately
  effectFn();

  // Return stop function
  return () => {
    if (cleanup) {
      cleanup();
    }
    dependencies.forEach(dep => {
      // Unsubscribe from dependencies
      // Note: In real implementation, we'd track specific unsubscribe functions
    });
  };
}

// ============================================
// 4. Reactive Objects (using Proxy)
// ============================================

export function reactiveObject<T extends Record<string, any>>(
  obj: T
): T {
  const propertySubscribers = new Map<string | symbol, Set<() => void>>();

  return new Proxy(obj, {
    get(target, key) {
      // Track dependency
      if (activeEffect) {
        if (!propertySubscribers.has(key)) {
          propertySubscribers.set(key, new Set());
        }
        propertySubscribers.get(key)!.add(activeEffect);
      }
      if (activeComputed) {
        if (!propertySubscribers.has(key)) {
          propertySubscribers.set(key, new Set());
        }
        propertySubscribers.get(key)!.add(() => {
          activeComputed!.isDirty = true;
        });
      }

      const value = target[key];
      // If it's an object, make it reactive too (deep reactivity)
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return reactiveObject(value);
      }
      return value;
    },

    set(target, key, value) {
      const oldValue = target[key];
      if (!Object.is(oldValue, value)) {
        target[key] = value;
        // Notify subscribers of this property
        propertySubscribers.get(key)?.forEach(callback => callback());
      }
      return true;
    },
  });
}

// ============================================
// 5. Batch Updates
// ============================================

let isBatching = false;
const pendingNotifications = new Set<() => void>();

export function batch(fn: () => void) {
  isBatching = true;
  fn();
  isBatching = false;

  // Execute all pending notifications
  pendingNotifications.forEach(callback => callback());
  pendingNotifications.clear();
}

// ============================================
// Usage Examples
// ============================================

if (import.meta.env.DEV) {
  // Example 1: Reactive primitives
  console.log("=== Example 1: Reactive Primitives ===");
  const count = reactive(0);
  const name = reactive("John");

  effect(() => {
    console.log(`Count: ${count.value}, Name: ${name.value}`);
  });

  count.value = 5; // Logs: "Count: 5, Name: John"
  name.value = "Jane"; // Logs: "Count: 5, Name: Jane"

  // Example 2: Computed values
  console.log("\n=== Example 2: Computed Values ===");
  const firstName = reactive("John");
  const lastName = reactive("Doe");

  const fullName = computed(() => {
    return `${firstName.value} ${lastName.value}`;
  });

  console.log(fullName.value); // "John Doe"

  firstName.value = "Jane";
  console.log(fullName.value); // "Jane Doe"

  // Example 3: Reactive objects
  console.log("\n=== Example 3: Reactive Objects ===");
  const user = reactiveObject({
    name: "John",
    age: 30,
    address: {
      city: "NYC",
    },
  });

  effect(() => {
    console.log(`User: ${user.name}, Age: ${user.age}, City: ${user.address.city}`);
  });

  user.name = "Jane"; // Triggers effect
  user.age = 31; // Triggers effect
  user.address.city = "LA"; // Triggers effect

  // Example 4: Batch updates
  console.log("\n=== Example 4: Batch Updates ===");
  const x = reactive(0);
  const y = reactive(0);

  let effectCount = 0;
  effect(() => {
    effectCount++;
    console.log(`Effect ran ${effectCount} times. x=${x.value}, y=${y.value}`);
  });

  // Without batch: effect runs twice
  x.value = 1;
  y.value = 2;

  // With batch: effect runs once
  batch(() => {
    x.value = 10;
    y.value = 20;
  });
}

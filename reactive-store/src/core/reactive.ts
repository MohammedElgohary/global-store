/**
 * Reactive - unified function for both primitives and objects
 * Automatically detects the type and uses the appropriate implementation
 */

import type { Reactive, Unsubscribe } from "../types";
import { getActiveEffect, getActiveComputed } from "./dependency";

const reactiveObjects = new WeakMap<object, object>();

/**
 * Check if a value should be treated as a reactive object (uses Proxy)
 */
function shouldUseProxy<T>(value: T): boolean {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp) &&
    !(value instanceof Map) &&
    !(value instanceof Set)
  );
}

/**
 * Create reactive object using Proxy (for objects)
 */
function createReactiveObject<T extends Record<string, any>>(obj: T): T {
  // Return existing reactive object if already created
  if (reactiveObjects.has(obj)) {
    return reactiveObjects.get(obj) as T;
  }

  const propertySubscribers = new Map<string | symbol, Set<() => void>>();

  const notify = (key: string | symbol) => {
    const subscribers = propertySubscribers.get(key);
    if (subscribers) {
      const subscribersCopy = Array.from(subscribers);
      subscribersCopy.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error(`Error in reactive object subscriber for ${String(key)}:`, error);
        }
      });
    }
  };

  const proxy = new Proxy(obj, {
    get(target, key: string | symbol) {
      // Track dependency if we're inside an effect
      const activeEffect = getActiveEffect();
      if (activeEffect) {
        if (!propertySubscribers.has(key)) {
          propertySubscribers.set(key, new Set());
        }
        propertySubscribers.get(key)!.add(activeEffect);
      }

      // Track dependency if we're inside a computed
      const activeComputed = getActiveComputed();
      if (activeComputed && "markDirty" in activeComputed) {
        if (!propertySubscribers.has(key)) {
          propertySubscribers.set(key, new Set());
        }
        const markDirty = (activeComputed as any).markDirty;
        if (markDirty && typeof markDirty === "function") {
          propertySubscribers.get(key)!.add(markDirty);
        } else {
          // Fallback
          const notifyComputed = () => {
            if ("isDirty" in activeComputed) {
              (activeComputed as any).isDirty = true;
            }
          };
          propertySubscribers.get(key)!.add(notifyComputed);
        }
      }

      const value = Reflect.get(target, key);

      // If it's an object, make it reactive too (deep reactivity)
      if (shouldUseProxy(value)) {
        return createReactiveObject(value);
      }

      return value;
    },

    set(target, key: string | symbol, value: unknown) {
      const oldValue = Reflect.get(target, key);
      if (!Object.is(oldValue, value)) {
        Reflect.set(target, key, value);
        notify(key);
      }
      return true;
    },

    deleteProperty(target, key: string | symbol) {
      const hadKey = Reflect.has(target, key);
      if (hadKey) {
        Reflect.deleteProperty(target, key);
        notify(key);
      }
      return hadKey;
    },
  });

  reactiveObjects.set(obj, proxy);
  return proxy;
}

/**
 * Create reactive primitive (for non-objects)
 */
function createReactivePrimitive<T>(initialValue: T): Reactive<T> {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  const notify = () => {
    // Create a copy to avoid issues if subscribers modify the set during iteration
    const subscribersCopy = Array.from(subscribers);
    subscribersCopy.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in reactive subscriber:", error);
      }
    });
  };

  return {
    get value(): T {
      // Track dependency if we're inside an effect
      const activeEffect = getActiveEffect();
      if (activeEffect) {
        subscribers.add(activeEffect);
      }

      // Track dependency if we're inside a computed
      const activeComputed = getActiveComputed();
      if (activeComputed && "markDirty" in activeComputed) {
        const markDirty = (activeComputed as any).markDirty;
        if (markDirty && typeof markDirty === "function") {
          subscribers.add(markDirty);
        } else {
          // Fallback for computed without markDirty
          const notifyComputed = () => {
            if ("isDirty" in activeComputed) {
              (activeComputed as any).isDirty = true;
            }
          };
          subscribers.add(notifyComputed);
        }
      }

      return value;
    },

    set value(newValue: T) {
      if (!Object.is(value, newValue)) {
        value = newValue;
        notify();
      }
    },

    subscribe(callback: () => void): Unsubscribe {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
  };
}

/**
 * Unified reactive function - works for both primitives and objects
 * 
 * @example
 * // Primitive - use .value
 * const count = reactive(0);
 * count.value = 10;
 * 
 * @example
 * // Object - direct property access
 * const user = reactive({ name: 'John' });
 * user.name = 'Jane';
 */
export function reactive<T>(initialValue: T): T extends Record<string, any> ? T : Reactive<T> {
  // If it's an object, use Proxy (direct property access)
  if (shouldUseProxy(initialValue)) {
    return createReactiveObject(initialValue as Record<string, any>) as any;
  }
  
  // Otherwise, use primitive wrapper (use .value)
  return createReactivePrimitive(initialValue) as any;
}

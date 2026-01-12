/**
 * Utility functions for reactive store
 */

import { reactive } from "./reactive";
import type { Reactive } from "../types";

/**
 * Shorthand for reactive - creates a reactive value
 * Alias for reactive() for convenience
 */
export function ref<T>(value: T): Reactive<T> {
  return reactive(value);
}

/**
 * Get the raw (non-reactive) value from a reactive object
 * For primitives, returns the value directly
 * For objects, returns the underlying object
 */
export function toRaw<T>(reactive: Reactive<T> | T): T {
  if (reactive && typeof reactive === "object" && "value" in reactive) {
    // It's a reactive primitive
    return (reactive as Reactive<T>).value;
  }
  // It's already raw or a reactive object (Proxy)
  return reactive as T;
}

/**
 * Mark an object as non-reactive (skip Proxy wrapping)
 * This is a marker function - actual implementation would need
 * to check for this marker in reactive()
 */
const rawMarkers = new WeakSet<object>();

export function markRaw<T extends object>(obj: T): T {
  rawMarkers.add(obj);
  return obj;
}

export function isRaw<T extends object>(obj: T): boolean {
  return rawMarkers.has(obj);
}

/**
 * Create shallow reactive object (only top-level properties are reactive)
 * For now, this is the same as reactive() but can be optimized later
 */
export function shallowReactive<T extends Record<string, any>>(obj: T): T {
  // For now, just use regular reactive
  // In the future, we can optimize to only track top-level properties
  return reactive(obj);
}

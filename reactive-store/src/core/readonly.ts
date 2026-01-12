/**
 * Readonly reactive - creates read-only reactive values
 */

import type { Reactive, Computed } from "../types";

export function readonly<T>(reactive: Reactive<T> | Computed<T>): {
  readonly value: T;
  subscribe: (callback: () => void) => () => void;
} {
  return {
    get value(): T {
      return reactive.value;
    },
    set value(_newValue: T) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Attempted to set value on readonly reactive. Changes are ignored."
        );
      }
      // Do nothing - prevent modification
    },
    subscribe: reactive.subscribe.bind(reactive),
  };
}

/**
 * Readonly reactive object - creates read-only reactive objects
 */
export function readonlyObject<T extends Record<string, any>>(
  obj: T
): Readonly<T> {
  const readonlyProxy = new Proxy(obj, {
    get(target, key) {
      return target[key];
    },
    set() {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Attempted to set property on readonly object. Changes are ignored."
        );
      }
      return false; // Prevent setting
    },
    deleteProperty() {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Attempted to delete property on readonly object. Changes are ignored."
        );
      }
      return false; // Prevent deletion
    },
  });

  return readonlyProxy as Readonly<T>;
}

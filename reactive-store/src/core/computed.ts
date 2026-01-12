/**
 * Computed values - derived reactive values that update automatically
 */

import type { Computed, Unsubscribe } from "../types";
import { getActiveComputed, setActiveComputed } from "./dependency";

interface ComputedInternal<T> extends Computed<T> {
  isDirty: boolean;
  dependencies: Set<() => void>;
  unsubscribeFunctions: Set<Unsubscribe>;
}

export function computed<T>(fn: () => T): Computed<T> {
  let value: T;
  let isDirty = true;
  const subscribers = new Set<() => void>();
  const unsubscribeFunctions = new Set<Unsubscribe>();

  const markDirty = () => {
    if (!isDirty) {
      isDirty = true;
      // Notify subscribers that computed value is now dirty
      const subscribersCopy = Array.from(subscribers);
      subscribersCopy.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          console.error("Error in computed subscriber:", error);
        }
      });
    }
  };

  const computedObj: ComputedInternal<T> = {
    get value(): T {
      const previousComputed = getActiveComputed();
      setActiveComputed(computedObj);

      if (isDirty) {
        // Clear old dependencies
        unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
        unsubscribeFunctions.clear();

        // Recompute
        try {
          value = fn();
          isDirty = false;
        } catch (error) {
          console.error("Error computing value:", error);
          setActiveComputed(previousComputed);
          throw error;
        }
      }

      setActiveComputed(previousComputed);
      return value;
    },

    subscribe(callback: () => void): Unsubscribe {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    isDirty: true,
    dependencies: new Set(),
    unsubscribeFunctions,
  };

  // Expose markDirty for reactive values to call
  (computedObj as any).markDirty = markDirty;

  // Initial computation
  computedObj.value;

  return computedObj;
}

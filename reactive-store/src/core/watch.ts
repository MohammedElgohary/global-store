/**
 * Watch - watch specific reactive values or properties for changes
 */

import type { Reactive, Computed, Unsubscribe } from "../types";
import { effect } from "./effect";

export type WatchSource<T> = Reactive<T> | Computed<T> | (() => T);
export type WatchCallback<T> = (newValue: T, oldValue: T) => void | (() => void);

interface WatchOptions {
  immediate?: boolean;
  deep?: boolean;
}

/**
 * Watch a single reactive value or computed value
 */
export function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options: WatchOptions = {}
): Unsubscribe {
  let oldValue: T;
  let isFirstRun = true;

  const getValue = (): T => {
    if (typeof source === "function") {
      return source();
    }
    return source.value;
  };

  const stop = effect(() => {
    const newValue = getValue();

    if (isFirstRun) {
      oldValue = newValue;
      isFirstRun = false;

      if (options.immediate) {
        const cleanup = callback(newValue, newValue);
        if (typeof cleanup === "function") {
          return cleanup;
        }
      }
      return;
    }

    // Only call callback if value actually changed
    if (!Object.is(oldValue, newValue)) {
      const cleanup = callback(newValue, oldValue);
      oldValue = newValue;
      if (typeof cleanup === "function") {
        return cleanup;
      }
    }
  });

  return stop;
}

/**
 * Watch multiple sources
 */
export function watchMultiple<T extends Array<WatchSource<any>>>(
  sources: T,
  callback: (values: { [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never }, oldValues: { [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never }) => void | (() => void),
  options: WatchOptions = {}
): Unsubscribe {
  let oldValues: Array<any>;
  let isFirstRun = true;

  const getValues = (): Array<any> => {
    return sources.map((source) => {
      if (typeof source === "function") {
        return source();
      }
      return source.value;
    });
  };

  const stop = effect(() => {
    const newValues = getValues();

    if (isFirstRun) {
      oldValues = [...newValues];
      isFirstRun = false;

      if (options.immediate) {
        const cleanup = callback(newValues as any, oldValues as any);
        if (typeof cleanup === "function") {
          return cleanup;
        }
      }
      return;
    }

    // Check if any value changed
    const hasChanged = newValues.some(
      (newVal, index) => !Object.is(oldValues[index], newVal)
    );

    if (hasChanged) {
      const cleanup = callback(newValues as any, oldValues as any);
      oldValues = [...newValues];
      if (typeof cleanup === "function") {
        return cleanup;
      }
    }
  });

  return stop;
}

/**
 * Watch a specific property of a reactive object
 */
export function watchProperty<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  key: K,
  callback: (newValue: T[K], oldValue: T[K]) => void | (() => void),
  options: WatchOptions = {}
): Unsubscribe {
  return watch(
    () => obj[key],
    callback,
    options
  );
}

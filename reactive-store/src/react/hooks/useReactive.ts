/**
 * React hook for reactive values
 */

import { useMemo, useSyncExternalStore, useCallback } from "react";
import { reactive, type Reactive } from "../../core";

export default function useReactive<T>(initialValue: T | (() => T)): [
  Reactive<T>,
  (value: T | ((prev: T) => T)) => void
] {
  const reactiveValue = useMemo(() => {
    const value = typeof initialValue === "function" 
      ? (initialValue as () => T)() 
      : initialValue;
    return reactive(value);
  }, []);

  const subscribe = useCallback(
    (callback: () => void) => reactiveValue.subscribe(callback),
    [reactiveValue]
  );

  const getSnapshot = useCallback(() => reactiveValue.value, [reactiveValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      if (typeof newValue === "function") {
        reactiveValue.value = (newValue as (prev: T) => T)(reactiveValue.value);
      } else {
        reactiveValue.value = newValue;
      }
    },
    [reactiveValue]
  );

  return [reactiveValue, setValue];
}

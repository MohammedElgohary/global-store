/**
 * React hook for reactive objects
 */

import { useMemo, useSyncExternalStore, useCallback, useRef, useState } from "react";
import { reactive, effect } from "../../core";

export default function useReactiveObject<T extends Record<string, any>>(
  initialValue: T | (() => T)
): [T, (updates: Partial<T> | ((prev: T) => Partial<T>)) => void] {
  const reactiveObj = useMemo(() => {
    const value = typeof initialValue === "function" 
      ? (initialValue as () => T)() 
      : initialValue;
    return reactive(value);
  }, []);

  const [, forceUpdate] = useState({});
  const versionRef = useRef(0);

  const subscribe = useCallback(
    (callback: () => void) => {
      // Use effect to track changes to the reactive object
      const stop = effect(() => {
        // Access all current properties to establish dependencies
        Object.keys(reactiveObj).forEach((key) => {
          const _ = reactiveObj[key];
        });
        // When any property changes, this effect re-runs
        versionRef.current++;
        callback();
      });

      return stop;
    },
    [reactiveObj]
  );

  const getSnapshot = useCallback(() => {
    // Return version number to trigger re-render when it changes
    return versionRef.current;
  }, []);

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const update = useCallback(
    (updates: Partial<T> | ((prev: T) => Partial<T>)) => {
      if (typeof updates === "function") {
        const changes = updates(reactiveObj);
        Object.assign(reactiveObj, changes);
      } else {
        Object.assign(reactiveObj, updates);
      }
      // Force update
      versionRef.current++;
      forceUpdate({});
    },
    [reactiveObj]
  );

  return [reactiveObj, update];
}

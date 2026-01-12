/**
 * React hook for watching reactive values
 */

import { useEffect, useRef } from "react";
import { watch, type WatchSource, type WatchCallback } from "../../core";

export default function useWatch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: { immediate?: boolean; deep?: boolean }
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const stop = watch(
      source,
      (newValue, oldValue) => {
        callbackRef.current(newValue, oldValue);
      },
      options
    );

    return stop;
  }, [source, options?.immediate, options?.deep]);
}

/**
 * React hook for computed values
 */

import { useMemo, useSyncExternalStore, useCallback } from "react";
import { computed, type Computed } from "../../core";

export default function useComputed<T>(
  fn: () => T,
  deps?: Array<any>
): Computed<T> {
  const computedValue = useMemo(() => computed(fn), deps || [fn]);

  const subscribe = useCallback(
    (callback: () => void) => computedValue.subscribe(callback),
    [computedValue]
  );

  const getSnapshot = useCallback(() => computedValue.value, [computedValue]);

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return computedValue;
}

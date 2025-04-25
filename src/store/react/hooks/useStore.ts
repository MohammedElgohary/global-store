import { useMemo, useCallback, useSyncExternalStore } from "react";
import type { useStoreProps, useStoreReturn } from "../../@types";
import { getOrCreateStore } from "../../functions";

export default function useStore<Value, Selected = Value>({
  key,
  defaultValue,
  persistOptions,
  selector,
  notifyDelay = 20,
}: useStoreProps<Value, Selected>): useStoreReturn<Value, Selected> {
  const memoizedDefault = useMemo(() => defaultValue, []);

  const storeInstance = useMemo(
    () =>
      getOrCreateStore({
        key,
        defaultValue: memoizedDefault,
        persistOptions,
        notifyDelay,
      }),
    [memoizedDefault, key, notifyDelay, persistOptions]
  );

  const getSnapshot = useCallback(() => {
    const raw = storeInstance.value ?? memoizedDefault!;

    if (selector) {
      return selector(raw);
    }

    return raw as unknown as Selected;
  }, [storeInstance, selector, memoizedDefault]);

  const subscribe = useCallback(
    (callback: () => void) => storeInstance.subscribe(callback),
    [storeInstance]
  );

  const selected = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setValue = useCallback(
    (newValue: Value | ((prev: Value) => Value)) => {
      storeInstance.value = newValue;
    },
    [storeInstance]
  );

  return useMemo(() => [selected, setValue], [selected, setValue]);
}

import { useMemo, useSyncExternalStore } from "react";
import { getOrCreateStore } from "../../functions";

export default function useStoreValue<Value>(
  key: string,
  fullback: Value
): Value {
  const storeInstance = useMemo(() => getOrCreateStore<Value>({ key }), [key]);

  const subscribe = useMemo(
    () => (callback: () => void) => storeInstance.subscribe(callback),
    [storeInstance]
  );

  return (
    useSyncExternalStore(
      subscribe,
      () => storeInstance.value,
      () => storeInstance.value
    ) || fullback
  );
}

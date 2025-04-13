import { useSyncExternalStore, useMemo } from "react";
import { getOrCreateStore } from "../store";

export default function useStoreSelector<Value = any, Selected = Value>(
  key: string,
  selector: (state: Value) => Selected
): Selected {
  const storeInstance = useMemo(() => getOrCreateStore<Value>({ key }), [key]);

  const subscribe = useMemo(
    () => (callback: () => void) => storeInstance.subscribe(callback),
    [storeInstance]
  );

  return useSyncExternalStore(
    subscribe,
    () => selector(storeInstance.value),
    () => selector(storeInstance.value)
  );
}

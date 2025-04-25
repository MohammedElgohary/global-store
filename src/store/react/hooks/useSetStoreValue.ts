import { useCallback } from "react";
import useStoreInstance from "./useStoreInstance";

export default function useSetStoreValue<Value>(key: string) {
  const store = useStoreInstance<Value>(key);

  return useCallback(
    (newValue: Value | ((previous: Value) => Value)) => {
      store.value = newValue;
    },
    [store]
  );
}

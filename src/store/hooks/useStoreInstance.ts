import { useMemo } from "react";
import { getOrCreateStore } from "../store";

export default function useStoreInstance<Value = any>(key: string) {
  return useMemo(() => getOrCreateStore<Value>({ key }), [key]);
}

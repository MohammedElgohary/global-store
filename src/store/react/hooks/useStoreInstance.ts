import { useMemo } from "react";
import { getOrCreateStore } from "../../functions";
import { Generic } from "../../@types";

export default function useStoreInstance<Value = Generic>(key: string) {
  return useMemo(() => getOrCreateStore<Value>({ key }), [key]);
}

import { getOrCreateStore } from "./store";
import type { CreateStoreProps } from "./@types";

export function createStore<Value>({
  key,
  defaultValue,
  persistOptions,
  notifyDelay,
}: CreateStoreProps<Value>) {
  return getOrCreateStore<Value>({
    key,
    defaultValue,
    persistOptions,
    notifyDelay,
  });
}

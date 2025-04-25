import type { CreateStoreProps } from "../@types";
import getOrCreateStore from "./getOrCreateStore";

export default function createStore<Value>({
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

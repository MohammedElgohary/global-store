import { storeConfig } from "../config";
import getOrCreateStore from "./getOrCreateStore";

export default function getStoreValue<Value>(key: string): Value | undefined {
  return getOrCreateStore({
    key,
    defaultValue: undefined,
    persistOptions: storeConfig.persistOptions,
    notifyDelay: storeConfig.notifyDelay,
  }).value as Value;
}

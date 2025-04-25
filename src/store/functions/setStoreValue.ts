import { storeConfig } from "../config";
import getOrCreateStore from "./getOrCreateStore";

export default function setStoreValue<Value>(
  key: string,
  value: Value | ((previous: Value) => Value)
) {
  getOrCreateStore({
    key,
    defaultValue: value,
    persistOptions: storeConfig.persistOptions,
    notifyDelay: storeConfig.notifyDelay,
  }).value = value;
}

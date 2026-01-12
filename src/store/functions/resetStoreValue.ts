import { getOrCreateStore } from "../functions";

export default function resetStoreValue<Value>(key: string): void {
  const store = getOrCreateStore<Value>({ key });

  if (typeof store.defaultValue !== "undefined") {
    store.value = store.defaultValue;
  }
}

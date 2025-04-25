import { StoreProps } from "../@types";
import { Store } from "../StoreClass";
import { store } from "../storeRegistry";
import { isEqual } from "../utils";

export default function getOrCreateStore<Value>({
  key,
  defaultValue,
  persistOptions,
  notifyDelay,
}: StoreProps<Value>): Store<Value> {
  const existing = store.get(key);

  if (!existing) {
    store.set(key, {
      value: defaultValue,
      defaultValue,
      persistOptions,
      instance: new Store<Value>({
        key,
        defaultValue,
        persistOptions,
        notifyDelay,
      }),
      subscribers: new Set(),
    });
  } else if (
    defaultValue !== undefined &&
    !isEqual(existing.defaultValue, defaultValue)
  ) {
    existing.defaultValue = defaultValue;
    const notifyDelay = existing.notifyDelay;

    existing.notifyDelay = 0;

    if (existing.value === undefined) {
      existing.instance.value = defaultValue;
    }
    existing.notifyDelay = notifyDelay;
  }

  return store.get(key)!.instance as Store<Value>;
}

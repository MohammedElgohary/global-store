import { Generic, PersistOptions, Subscriber } from "./@types";
import { Store } from "./StoreClass";

export const store = new Map<
  string,
  {
    value: Generic;
    defaultValue?: Generic;
    persistOptions?: PersistOptions<Generic>;
    instance: Store<Generic>;
    subscribers: Set<Subscriber>;
    notifyDelay?: number;
  }
>();

export const debouncedKeys = new Map<string, ReturnType<typeof setTimeout>>();

export let isBatching = false;
export const pendingKeys = new Set<string>();

export function startBatching() {
  isBatching = true;
}

export function endBatching() {
  isBatching = false;
}

export const storeValues = new Proxy<Record<string, Generic>>({} as Generic, {
  get(_, key: string | symbol) {
    if (typeof key !== "string") return undefined;

    const record = store.get(key);
    return record?.value;
  },

  set(_, key: string | symbol, value: Generic) {
    if (typeof key !== "string") return false;

    const record = store.get(key);

    if (record) {
      record.instance.value = value;
      return true;
    }

    return false;
  },

  has(_, key: string | symbol) {
    return typeof key === "string" && store.has(key);
  },

  ownKeys() {
    return Array.from(store.keys());
  },

  getOwnPropertyDescriptor(_, key: string | symbol) {
    if (typeof key === "string" && store.has(key)) {
      return {
        enumerable: true,
        configurable: true,
      };
    }

    return undefined;
  },
});

import { Generic, PersistOptions, StoreProps, Subscriber } from "./@types";
import { storeConfig } from "./config";
import { getOrCreateStore } from "./functions";
import { debouncedKeys, isBatching, pendingKeys, store } from "./storeRegistry";

export class Store<Value = Generic> {
  key: string;
  defaultValue?: Value;
  private persistOptions?: PersistOptions<Value>;
  private notifyDelay?: number;

  constructor({
    key,
    defaultValue,
    persistOptions = false,
    notifyDelay,
  }: StoreProps<Value>) {
    this.key = key;

    this.persistOptions =
      persistOptions ||
      store.get(key)?.persistOptions ||
      storeConfig.persistOptions;

    this.defaultValue = defaultValue;
    this.notifyDelay =
      notifyDelay || store.get(key)?.notifyDelay || storeConfig.notifyDelay;

    const existing = store.get(key);

    if (!existing) {
      let value = defaultValue;

      if (this.persistOptions) {
        const saved = this.persistOptions.persistGetter(key);
        if (saved instanceof Promise) {
          saved.then((savedValue) => {
            getOrCreateStore({ key }).value = savedValue ?? defaultValue;
          });
        } else {
          value = saved ?? defaultValue;
        }
      }

      store.set(key, {
        value,
        defaultValue,
        persistOptions: this.persistOptions,
        instance: this,
        subscribers: new Set(),
        notifyDelay,
      });
    }
  }

  get value(): Value {
    return store.get(this.key)?.value ?? this.defaultValue;
  }

  set value(newValue: Value | ((previous: Value) => Value)) {
    const current = this.value;
    const next =
      typeof newValue === "function"
        ? (newValue as (prev: Value) => Value)(current)
        : newValue;

    if (Object.is(current, next)) {
      return;
    }

    store.set(this.key, {
      instance: this,
      defaultValue: this.defaultValue,
      persistOptions: this.persistOptions,
      notifyDelay: this.notifyDelay,
      subscribers: store.get(this.key)?.subscribers || new Set(),
      value: next,
    });

    if (this.persistOptions) {
      this.persistOptions.persistSetter(this.key, next);
    }

    this.notify();

    if (storeConfig.debug && process.env.NODE_ENV === "development") {
      console.debug(
        `%c[${storeConfig.name}]%c ${
          this.key
        }%c changed from %c${JSON.stringify(current)}%c to %c${JSON.stringify(
          next
        )}`,
        "color: orange ; font-weight: bold; background: black; padding: 0.25rem;", // [store name]
        "color: yellow ; font-weight: bold; background: black; padding: 0.25rem;", // key
        "color: #60a5fa ; background: black; padding: 0.25rem;", // "changed from"
        "color: #ef4444 ; font-weight: bold; background: black; padding: 0.25rem;", // current
        "color: #60a5fa ; background: black; padding: 0.25rem;", // "to"
        "color: #22c55e ; font-weight: bold; background: black; padding: 0.25rem;" // next
      );
    }
  }

  subscribe(callback: Subscriber) {
    store.get(this.key)?.subscribers.add(callback);

    return () => {
      store.get(this.key)?.subscribers.delete(callback);
    };
  }

  private cancelNotify() {
    if (debouncedKeys.has(this.key)) {
      clearTimeout(debouncedKeys.get(this.key)!);
      debouncedKeys.delete(this.key);
    }
  }

  private notify() {
    if (isBatching) {
      pendingKeys.add(this.key);
      return;
    }

    this.cancelNotify();

    const triggerSubscribers = () => {
      const subscribers = store.get(this.key)?.subscribers;

      if (subscribers) {
        for (const subscriber of Array.from(subscribers)) {
          subscriber();
        }
      }
    };

    if (this.notifyDelay) {
      const timeoutId = setTimeout(triggerSubscribers, this.notifyDelay);
      debouncedKeys.set(this.key, timeoutId);

      return;
    }

    triggerSubscribers();
  }
}

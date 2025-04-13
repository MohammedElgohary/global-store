/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, useEffect, useMemo, useState } from "react";
import type {
  Config,
  PersistOptions,
  StoreProps,
  SubscribeReturnType,
} from "./@types";
import { isEqual } from "./utils/isEqual";

const storeConfig: Config = {
  name: "Global Store",
  debug: false,
  persistOptions: undefined,
  notifyDelay: 20,
};

const store = new Map<
  string,
  {
    value: any;
    defaultValue?: any;
    persistOptions?: PersistOptions<any>;
    instance: Store<any>;
    subscribers: Set<() => void>;
    notifyDelay?: number;
  }
>();
const debouncedKeys = new Map<string, ReturnType<typeof setTimeout>>();

export let isBatching = false;
export const pendingKeys = new Set<string>();

export class Store<Value = any> {
  key: string;
  defaultValue?: Value;
  private persistOptions?: PersistOptions<Value>;
  private notifyDelay?: number;

  constructor({
    key,
    defaultValue,
    persistOptions,
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

      if (this.persistOptions?.persist) {
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

    if (this.persistOptions?.persist) {
      this.persistOptions.persistSetter(this.key, current, next);
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

  subscribe(callback: () => void) {
    store.get(this.key)?.subscribers.add(callback);

    return () => {
      store.get(this.key)?.subscribers.delete(callback);
    };
  }

  private notify() {
    if (isBatching) {
      pendingKeys.add(this.key);
      return;
    }

    if (debouncedKeys.has(this.key)) {
      clearTimeout(debouncedKeys.get(this.key)!);
      debouncedKeys.delete(this.key);
    }

    const triggerSubscribers = () => {
      const subscribers = store.get(this.key)?.subscribers;

      if (subscribers) {
        for (const subscriber of Array.from(subscribers)) {
          subscriber();
        }
      }
    };

    if (this.notifyDelay) {
      const timeout = setTimeout(triggerSubscribers, this.notifyDelay);
      debouncedKeys.set(this.key, timeout);

      return;
    }

    triggerSubscribers();
  }
}

export function getOrCreateStore<Value>({
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

  return store.get(key)!.instance;
}

export function batch(batchFunc: () => void) {
  isBatching = true;
  batchFunc();
  isBatching = false;

  for (const key of Array.from(pendingKeys)) {
    const subscribers = store.get(key)?.subscribers;

    if (subscribers) {
      for (const subscriber of Array.from(subscribers)) {
        subscriber();
      }
    }
  }

  pendingKeys.clear();
}

export function subscribe<
  Props extends {
    store?: Record<string, any>;
    storeInstances?: Record<string, any>;
  },
  Keys extends Array<string>
>(
  Component: (props: Props) => JSX.Element,
  keys: Keys
): (props: SubscribeReturnType<Props>) => JSX.Element {
  return function SubscribedComponent(props: SubscribeReturnType<Props>) {
    const [, forceUpdate] = useState({});

    const instances = useMemo(
      () => keys.map((key) => getOrCreateStore({ key })),
      []
    );

    useEffect(() => {
      const unsubscribes = instances.map((instance) =>
        instance.subscribe(() => {
          forceUpdate({});
        })
      );

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    }, [instances]);

    const storeState = {} as Record<(typeof keys)[number], any>;
    const storeInstances = {} as Record<(typeof keys)[number], Store<any>>;

    instances.forEach((instance) => {
      storeState[instance.key as (typeof keys)[number]] = instance.value;
      storeInstances[instance.key as (typeof keys)[number]] = instance;
    });

    return Component({
      ...(props as Props),
      store: storeState,
      storeInstances,
    });
  };
}

export function setStoreValue<Value = any>(
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

export function getStoreValue<Value = any>(key: string): Value | undefined {
  return getOrCreateStore({
    key,
    defaultValue: undefined,
    persistOptions: storeConfig.persistOptions,
    notifyDelay: storeConfig.notifyDelay,
  }).value as Value;
}

export function configureStore(config: Partial<Config>) {
  Object.assign(storeConfig, {
    ...storeConfig,
    ...config,
  });
}

export const storeValues = new Proxy<Record<string, any>>({} as any, {
  get(_, key: string | symbol) {
    if (typeof key !== "string") return undefined;

    const record = store.get(key);
    return record?.value;
  },

  set(_, key: string | symbol, value: any) {
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

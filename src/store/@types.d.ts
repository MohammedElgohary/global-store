/* eslint-disable @typescript-eslint/no-explicit-any */
export type PersistOptions<Value = any> =
  | {
      persist: false;
    }
  | {
      persist: true;
      persistGetter: (key: string) => Value | Promise<Value>;
      persistSetter: (
        key: string,
        previous: Value,
        next: Value
      ) => void | Promise<void>;
    };

export type Config<Value = any> = {
  name?: string;
  debug?: boolean;
  persistOptions?: PersistOptions<Value>;
  notifyDelay?: number;
};

export type StoreProps<Value = any> = {
  key: string;
  defaultValue?: Value;
  persistOptions?: PersistOptions<Value>;
  notifyDelay?: number;
};

export type Store<Value = any> = {
  key: string;
  value: Value | ((previous: Value) => Value);
  defaultValue: Value;
  persistOptions?: PersistOptions<Value>;
  load: (
    loader: (key?: string, signal?: AbortSignal) => Promise<Value>
  ) => void;
  subscribe: (callback: () => void) => () => void;
};

export type SubscribeReturnType<Props> = Omit<
  Props,
  "store" | "storeInstances"
>;

/***
 * useStore Types
 */
export type useStoreProps<Value, Selected = Value> = {
  key: string;
  defaultValue?: Value;
  persistOptions?: PersistOptions<Value>;
  selector?: (value: Value) => Selected;
  notifyDelay?: number;
};
export type useStoreReturn<Value, Selected> = [
  value: Selected,
  setter: (newValue: Value | ((previous: Value) => Value)) => void
];

/***
 * createStore Types
 */
export type CreateStoreProps<Value> = {
  key: string;
  defaultValue: Value;
  persistOptions?: PersistOptions<Value>;
  notifyDelay?: number;
};

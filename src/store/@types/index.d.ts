export type PersistOptions<Value = Generic> =
  | false
  | {
      persistGetter: (key: string) => Value | Promise<Value>;
      persistSetter: (key: string, newValue: Value) => void | Promise<void>;
    };

export type Config<Value = Generic> = {
  name?: string;
  debug?: boolean;
  persistOptions?: PersistOptions<Value>;
  notifyDelay?: number;
};

export type StoreProps<Value = Generic> = {
  key: string;
  defaultValue?: Value;
  persistOptions?: PersistOptions<Value>;
  notifyDelay?: number;
};

export type Subscriber = () => void;

export type SubscribeReturnType<Props> = Omit<
  Props,
  "store" | "storeInstances"
>;

/***
 * useStore Types
 */
export type useStoreProps<Value = Generic, Selected = Value> = {
  key: string;
  defaultValue?: Value;
  persistOptions?: PersistOptions<Value>;
  selector?: (value: Value) => Selected;
  notifyDelay?: number;
};
export type useStoreReturn<Value = Generic, Selected> = [
  value: Selected,
  setter: (newValue: Value | ((previous: Value) => Value)) => void
];

/***
 * createStore Types
 */
export type CreateStoreProps<Value = Generic> = {
  key: string;
  defaultValue: Value;
  persistOptions?: PersistOptions<Value>;
  notifyDelay?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Generic = any;

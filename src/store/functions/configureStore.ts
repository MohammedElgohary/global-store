import { Config } from "../@types";
import { storeConfig } from "../config";

export default function configureStore<Value>(config: Partial<Config<Value>>) {
  Object.assign(storeConfig, { ...storeConfig, ...config });
}

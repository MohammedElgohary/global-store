import { useEffect, useRef } from "react";
import { getOrCreateStore } from "../../functions";
import { storeConfig } from "../../config";

export default function useStoreDebug<Value>(key: string) {
  const previousRef = useRef<Value | undefined>(undefined);

  useEffect(() => {
    const store = getOrCreateStore<Value>({ key });

    const logChange = () => {
      const current = previousRef.current;
      const next = store.value;

      console.debug(
        `%c[${storeConfig.name}]%c ${key}%c changed from %c${JSON.stringify(
          current
        )}%c to %c${JSON.stringify(next)}`,
        "color: orange; font-weight: bold; background: black; padding: 0.25rem;",
        "color: yellow; font-weight: bold; background: black; padding: 0.25rem;",
        "color: #60a5fa; background: black; padding: 0.25rem;",
        "color: #ef4444; font-weight: bold; background: black; padding: 0.25rem;",
        "color: #60a5fa; background: black; padding: 0.25rem;",
        "color: #22c55e; font-weight: bold; background: black; padding: 0.25rem;"
      );

      previousRef.current = next;
    };

    previousRef.current = store.value;
    const unsubscribe = store.subscribe(logChange);

    return () => {
      unsubscribe();
    };
  }, [key]);
}

import { ComponentType, JSX, memo, useEffect, useMemo, useState } from "react";
import { Generic, SubscribeReturnType } from "../../@types";
import { getOrCreateStore } from "../../functions";
import { Store } from "../../StoreClass";

export default function withStore<
  Props extends {
    store?: Record<string, Generic>;
    storeInstances?: Record<string, Generic>;
  },
  Keys extends Array<string>
>(
  Component: (props: Props) => JSX.Element,
  keys: Keys
): ComponentType<SubscribeReturnType<Props>> {
  function SubscribedComponent(props: SubscribeReturnType<Props>) {
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

    const storeState = {} as Record<(typeof keys)[number], Generic>;
    const storeInstances = {} as Record<(typeof keys)[number], Store<Generic>>;

    instances.forEach((instance) => {
      storeState[instance.key as (typeof keys)[number]] = instance.value;
      storeInstances[instance.key as (typeof keys)[number]] = instance;
    });

    return Component({
      ...(props as Props),
      store: storeState,
      storeInstances,
    });
  }

  return memo(SubscribedComponent);
}

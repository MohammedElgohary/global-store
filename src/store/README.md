# Global Store

- Access your state any where
- React friendly store manager
- Easily and accessible state management

- ## `configureStore`

  - sets the store base config

    ```tsx
    configureStore({
      debug: true,
      name: "Our Store",
      persistOptions: {
        persist: true,
        persistGetter(key) {
          if (!window.localStorage || !window.localStorage.getItem(key)) {
            return;
          }

          return JSON.parse(localStorage.getItem(key) || "null");
        },
        persistSetter(key, _, next) {
          localStorage.setItem(key, JSON.stringify(next));
        },
      },
    });
    ```

---

- ## `useStore`

  - Returns [`value`, `setValue`]
  - supports `selectors` and `persist`

    ```tsx
    export function useUsers() {
      return useStore<Array<{ id: number; name: string }>, Array<string>>({
        key: "users",
        defaultValue: [],
        selector(users) {
          return users.map((user) => user.name);
        },
      });
    }
    ```

  - you can use debounce by

    ```tsx
    export function useUsersSearch() {
      return useStore<string>({
        key: "usersSearch",
        defaultValue: "",
        notifyDelay: 500,
      });
    }
    ```

---

- ## `subscribe`

  - Higher order function to subscribe in store keys
  - Passes `store` and `storeInstances`
  - `store` will curry the reactive values
  - `storeInstances` will have the store instance which can full control the store value reactively

    ```tsx
    const SomeComponent = subscribe(
      ({
        store,
        storeInstances, // Optional if needed
        name,
      }: {
        store: {
          counter: number;
          users: Array<string>;
        };
        storeInstances: {
          counter: Store<number>;
          users: Store<
            Array<{
              id: number;
              name: string;
            }>
          >;
        };
        name: string;
      }) => {
        const users = storeInstances.users;
        const counter = storeInstances.counter;

        // Mutate value
        counter.value = (counter) => counter + 1;

        // Setting value
        counter.value = 15;

        return <>...</>;
      },
      ["users", "counter"]
    );
    ```

---

- ## `getStoreValue` and `setStoreValue`

  - `getStoreValue` gets the current store value in or outside react
    ```tsx
    console.log(getStoreValue("counter"));
    ```
  - `setStoreValue` sets the store value reactively in or outside react

    ```tsx
    // Mutation
    setStoreValue("counter", (counter) => counter + 1);

    // Setting the value
    setStoreValue("counter", 15);
    ```

---

- ## `batch`

  - is used for performed setting multiple values

    ```tsx
    useEffect(() => {
      batch(() => {
        users.value = Array({ length: 10000 }).fill({
          id: Math.random() * 9999 + Date.now(),
          name: `User ${Date.now()}`,
        });

        counter.value = 15;
      });
    }, []);
    ```

- ## `createStore`

  - creates a store instance that can fully control the store key

    ```tsx
    export const usersStore = createStore({
      key: "users",
      defaultValue: [],
    });
    ```

import { useEffect } from "react";
import { requestGetUsers } from "../../network";
import { useStore } from "../../store";
import { Action, ActionHandlers, State } from "./interface";
import debounce from "debounce-promise";

const initialState: State = {
  users: [],
  page: 1,
  pageSize: 10,
  isLoading: false,
  filters: {},
  error: null,
};

const actionHandlers: ActionHandlers = {
  "start-fetching": (state) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  "replace-users": (state, { users, page, pageSize }) => ({
    ...state,
    isLoading: false,
    error: null,
    users,
    page,
    pageSize,
  }),
  "change-filters": (state, { filters }) => ({
    ...state,
    isLoading: true,
    error: null,
    filters,
  }),
  "fetch-error": (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

const debouncedGetUsers = debounce(requestGetUsers, 500);

export function useUsers() {
  const [state, setState] = useStore<State>({
    key: "users",
    defaultValue: initialState,
  });

  function dispatch<T extends Action["type"]>(
    action: T,
    payload?: Omit<Extract<Action, { type: T }>, "type">
  ) {
    setState((state) => actionHandlers[action](state, payload));
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    requestGetUsers({ page: 1, pageSize: state.pageSize }, signal)
      .then(({ page, pageSize, users }) => {
        dispatch("replace-users", {
          users,
          page,
          pageSize,
        });
      })
      .catch((error) => {
        if (signal.aborted || error.name === "AbortError") {
          return;
        }

        console.error(error);

        dispatch("fetch-error", { error });
      });

    return () => {
      controller.abort();
    };
  }, []);

  function loadPage(page: number) {
    if (page <= 0) {
      return;
    }

    dispatch("start-fetching");

    requestGetUsers({ page: page, pageSize: state.pageSize })
      .then(({ page, pageSize, users }) => {
        dispatch("replace-users", {
          users,
          page,
          pageSize,
        });
      })
      .catch((error) => {
        console.error(error);

        dispatch("fetch-error", { error });
      });
  }

  function changeFilters(filters: State["filters"]) {
    dispatch("change-filters", { filters });

    debouncedGetUsers({ page: 1, pageSize: state.pageSize })
      .then(({ page, pageSize, users }) => {
        dispatch("replace-users", {
          users,
          page,
          pageSize,
        });
      })
      .catch((error) => {
        console.error(error);

        dispatch("fetch-error", { error });
      });
  }

  return {
    ...state,
    loadPage,
    changeFilters,
  };
}

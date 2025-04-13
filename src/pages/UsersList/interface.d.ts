import { User } from "../../domain/models";

export type State = {
  users: Array<User>;
  page: number;
  pageSize: number;
  isLoading: boolean;
  filters: {
    search?: string;
  };
  error: string | Error | null;
};

interface StartFetchingAction {
  type: "start-fetching";
}
interface ReplaceDataAction {
  type: "replace-users";
  users: Array<User>;
  page: number;
  pageSize: number;
}
interface ChangeFiltersAction {
  type: "change-filters";
  filters: State["filters"];
}
interface FetchErrorAction {
  type: "fetch-error";
  error: string | Error;
}

export type Action =
  | StartFetchingAction
  | ReplaceDataAction
  | ChangeFiltersAction
  | FetchErrorAction;

type ActionHandlers = {
  [Key in Action["type"]]: (
    state: State,
    action: Omit<Extract<Action, { type: Key }>, "type">
  ) => State;
};

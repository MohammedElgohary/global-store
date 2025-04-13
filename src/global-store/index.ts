import { User } from "../domain/models";
import { createStore } from "../store";

export const userStore = createStore<{
  users: Array<User>;
  page: number;
  pageSize: number;
}>({
  key: "users",
  defaultValue: {
    users: [],
    page: 1,
    pageSize: 10,
  },
});

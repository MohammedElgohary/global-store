import { User } from "../domain/models";
import { instance } from "./instance";

//#region get users
type RequestGetUsersArgs = {
  page: number;
  pageSize: number;
};
type RequestGetUsersResponse = Array<User>;
type RequestGetUsersResult = {
  users: Array<User>;
  page: number;
  pageSize: number;
};

export async function requestGetUsers(
  { page, pageSize }: RequestGetUsersArgs,
  signal?: AbortSignal
): Promise<RequestGetUsersResult> {
  const { data } = await instance.get<RequestGetUsersResponse>("/users", {
    signal,
  });

  return {
    users: data,
    page,
    pageSize,
  };
}
//#endregion get users

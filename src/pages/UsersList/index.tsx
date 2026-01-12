import { useEffect } from "react";
import { useUsers } from "./useUsers";
import { setStoreValue } from "../../store";
import { User } from "../../domain/models";
import { State } from "./interface";

export default function UsersList() {
  const { changeFilters, error, filters, isLoading, loadPage, page, users } =
    useUsers();

  useEffect(() => {
    if (!error) {
      return;
    }

    console.error(error instanceof Error ? error.message : error);
  }, [error]);

  function handleDeleteUser(id: number) {
    setStoreValue<State>("users", (state) => {
      return {
        ...state,
        users: state.users.filter((user: User) => user.id !== id),
      };
    });
  }

  return (
    <div className="users">
      <input
        placeholder="Search Users"
        onChange={(event) => changeFilters({ search: event.target.value })}
        defaultValue={filters.search}
      />
      <button
        onClick={() => {
          loadPage(page - 1);
        }}
      >
        Previous
      </button>
      Page: {page}
      <button
        onClick={() => {
          loadPage(page + 1);
        }}
      >
        Next
      </button>
      {users.length == 0 && !isLoading && <div>No Users Found</div>}
      {isLoading && <div>Loading...</div>}
      {users.length > 0 && !isLoading && (
        <div className="users_list">
          {users.map((user) => (
            <div key={user.id} className="user">
              <div>{user.name}</div>

              <button onClick={() => handleDeleteUser(user.id)}>remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

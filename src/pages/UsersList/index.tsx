import { useEffect } from "react";
import { useUsers } from "./useUsers";

export default function UsersList() {
  const { changeFilters, error, filters, isLoading, loadPage, page, users } =
    useUsers();

  useEffect(() => {
    if (!error) {
      return;
    }

    console.error(error instanceof Error ? error.message : error);
  }, [error]);

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

              <button>remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

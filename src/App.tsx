import UsersList from "./pages/UsersList";
import { useStoreValue } from "./store";

export default function App() {
  return (
    <main>
      {/* No Users defined yet ( Reading data from store when it's available ) */}
      <Users />
      {/* Users List */}
      <UsersList />
    </main>
  );
}

function Users() {
  const users = useStoreValue("users", []);
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}

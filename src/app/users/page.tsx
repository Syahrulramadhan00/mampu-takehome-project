import UsersTable from "@/components/features/UserTable";
import { getEnrichedUsers } from "@/services/api";

export const metadata = {
  title: "Users Directory | Mampu",
  description: "Manage and view all users and their activities.",
};

export default async function UsersPage() {
  const users = await getEnrichedUsers();

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Users Directory</h1>
        <p className="text-gray-500 mt-2">Manage users and monitor their recent activity.</p>
      </div>
            <UsersTable initialUsers={users} />
    </main>
  );
}
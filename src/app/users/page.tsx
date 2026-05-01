import UsersTable from "@/components/features/UserTable";
import { getEnrichedUsers } from "@/services/api";

export const metadata = {
  title: "Users Directory | Mampu",
  description: "Manage and view all users and their activities.",
};

export default async function UsersPage() {
  const users = await getEnrichedUsers();

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>Users Directory</h1>
          <p className="mt-3 text-lg text-gray-600">Manage and monitor all users and their recent activity.</p>
        </div>
        {users.length > 0 ? (
          <UsersTable initialUsers={users} />
        ) : (
          <div className="text-center py-16 border border-dashed border-input rounded-lg">
            <p className="text-lg text-muted-foreground">No users found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
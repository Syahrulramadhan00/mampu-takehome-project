
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { EnrichedUser } from "@/types";
import { Search, ArrowUpDown } from "lucide-react";

interface UsersTableProps {
  initialUsers: EnrichedUser[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL to preserve navigation
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "name";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);

  // Update URL seamlessly when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy !== "name") params.set("sort", sortBy);
    
    router.replace(`/users?${params.toString()}`, { scroll: false });
  }, [searchTerm, sortBy, router]);

  // Client-side filtering and sorting
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...initialUsers];

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "pendingTodos") return b.activity.pendingTodos - a.activity.pendingTodos; // Highest pending first
      return 0;
    });

    return result;
  }, [initialUsers, searchTerm, sortBy]);

  return (
    <div className="space-y-4">
      {/* Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="name">Sort by Name (A-Z)</option>
          <option value="pendingTodos">Sort by Pending Todos (High - Low)</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredAndSortedUsers.length === 0 && (
        <div className="text-center py-12 bg-white border rounded-lg">
          <p className="text-gray-500 text-lg">No users found matching your filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSortBy('name'); }}
            className="text-blue-600 hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Responsive List: Cards on Mobile, Table rows on Desktop */}
      <div className="grid gap-4 md:gap-0">
        {/* Desktop Header (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 rounded-t-lg border-x border-t text-sm font-semibold text-gray-600">
          <div className="col-span-3">User</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2 text-center">Posts</div>
          <div className="col-span-2 text-center text-green-600">Done Todos</div>
          <div className="col-span-2 text-center text-orange-600">Pending Todos</div>
        </div>

        {/* Data Rows */}
        <div className="flex flex-col gap-4 md:gap-0 md:border md:rounded-b-lg overflow-hidden bg-white">
          {filteredAndSortedUsers.map((user) => (
            <Link 
              key={user.id} 
              href={`/users/${user.id}`}
              className="block md:grid grid-cols-12 gap-4 px-6 py-4 border rounded-lg md:rounded-none md:border-0 md:border-b last:border-b-0 hover:bg-gray-50 transition shadow-sm md:shadow-none"
            >
              <div className="col-span-3 mb-2 md:mb-0">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
              
              <div className="col-span-3 mb-4 md:mb-0">
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                <p className="text-sm text-blue-600 truncate">{user.website}</p>
              </div>

              {/* Mobile label wrappers for stats */}
              <div className="col-span-2 flex justify-between md:block text-center text-sm">
                <span className="md:hidden text-gray-500">Posts:</span>
                <span className="font-medium bg-gray-100 px-2 py-1 rounded-full">{user.activity.totalPosts}</span>
              </div>
              
              <div className="col-span-2 flex justify-between md:block text-center text-sm">
                <span className="md:hidden text-gray-500">Completed:</span>
                <span className="font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">{user.activity.completedTodos}</span>
              </div>
              
              <div className="col-span-2 flex justify-between md:block text-center text-sm">
                <span className="md:hidden text-gray-500">Pending:</span>
                <span className="font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded-full">{user.activity.pendingTodos}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
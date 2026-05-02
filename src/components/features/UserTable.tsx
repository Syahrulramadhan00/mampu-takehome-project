"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Inbox } from "lucide-react";
import { EnrichedUser } from "@/types";

// shadcn/ui imports
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface UsersTableProps {
  initialUsers: EnrichedUser[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "name";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);

  // Sync state to URL seamlessly
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
      if (sortBy === "pendingTodos") return b.activity.pendingTodos - a.activity.pendingTodos;
      return 0;
    });

    return result;
  }, [initialUsers, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name (A-Z)</SelectItem>
              <SelectItem value="pendingTodos">Most Pending Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-gray-50 border-dashed">
          <Inbox className="w-10 h-10 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSortBy('name'); }}
            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Desktop View: Accessible Table */}
      {filteredAndSortedUsers.length > 0 && (
        <div className="hidden md:block border rounded-md bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[300px]">User Details</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead className="text-center">Total Posts</TableHead>
                <TableHead className="text-center">Pending Todos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer transition-colors"
                  onClick={() => router.push(`/users/${user.id}`)}
                >
                  <TableCell>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-900">{user.email}</p>
                    <a 
                      href={`https://${user.website}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking link
                    >
                      {user.website}
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {user.activity.totalPosts}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.activity.pendingTodos > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.activity.pendingTodos}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mobile View: Cards (Prevents squeezed tables) */}
      {filteredAndSortedUsers.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredAndSortedUsers.map((user) => (
            <Link key={user.id} href={`/users/${user.id}`}>
              <Card className="hover:border-gray-400 transition-colors shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs text-gray-500 mb-1">Pending</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {user.activity.pendingTodos}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{user.email}</div>
                  <div className="text-sm text-blue-600">{user.website}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
// src/services/api.ts
import { User, Post, Todo, EnrichedUser } from "@/types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Base fetcher with ISR Bonus implemented
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return res.json();
}

export async function getEnrichedUsers(): Promise<EnrichedUser[]> {
  // Promise.all to fetch everything concurrently - highly performant
  const [users, posts, todos] = await Promise.all([
    fetchAPI<User[]>("/users"),
    fetchAPI<Post[]>("/posts"),
    fetchAPI<Todo[]>("/todos"),
  ]);

  // Aggregate the data for Task 4
  return users.map((user) => {
    const userPosts = posts.filter((p) => p.userId === user.id);
    const userTodos = todos.filter((t) => t.userId === user.id);
    
    const completedTodos = userTodos.filter((t) => t.completed).length;
    const pendingTodos = userTodos.length - completedTodos;

    return {
      ...user,
      activity: {
        totalPosts: userPosts.length,
        completedTodos,
        pendingTodos,
      },
    };
  });
}

export async function getUserDetails(userId: string): Promise<User> {
  return fetchAPI<User>(`/users/${userId}`);
}
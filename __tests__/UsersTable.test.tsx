// __tests__/UsersTable.test.tsx
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import UsersTable from '@/components/features/UserTable';
import type { EnrichedUser } from '@/types';


// Mock Data representing our EnrichedUser type
const mockUsers = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    website: "hildegard.org",
    phone: "1-770-736-8031",
    company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" },
    address: { street: "Kulas Light", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874" },
    activity: { totalPosts: 10, completedTodos: 5, pendingTodos: 15 }
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    website: "anastasia.net",
    phone: "010-692-6593",
    company: { name: "Deckow-Crist", catchPhrase: "Proactive didactic contingency" },
    address: { street: "Victor Plains", suite: "Suite 879", city: "Wisokyburgh", zipcode: "90566-7771" },
    activity: { totalPosts: 5, completedTodos: 10, pendingTodos: 0 }
  }
];

describe('UsersTable Component', () => {
  it('renders users with derived activity signals', () => {
    render(<UsersTable initialUsers={mockUsers as EnrichedUser[]} />);
    
    // Use getAllByText because responsive UI renders the name twice (Table & Card)
    expect(screen.getAllByText('Leanne Graham')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Ervin Howell')[0]).toBeInTheDocument();
    
    // Check if derived signals rendered
    expect(screen.getAllByText('15')[0]).toBeInTheDocument(); 
    expect(screen.getAllByText('0')[0]).toBeInTheDocument();
  });

  it('filters users by search input', () => {
    render(<UsersTable initialUsers={mockUsers as EnrichedUser[]} />);
    
    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    
    fireEvent.change(searchInput, { target: { value: 'Ervin' } });
    
    // Ervin should remain, Leanne should disappear
    expect(screen.getAllByText('Ervin Howell')[0]).toBeInTheDocument();
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
  });

  it('shows an empty state when filters remove all rows', () => {
    render(<UsersTable initialUsers={mockUsers as EnrichedUser[]} />);
    
    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    
    // Type gibberish
    fireEvent.change(searchInput, { target: { value: 'XYZ123NonExistent' } });
    
    // Matches the updated shadcn/ui text
    expect(screen.getByText('No users found')).toBeInTheDocument();
    expect(screen.getByText(/Clear all filters/i)).toBeInTheDocument();
  });
});
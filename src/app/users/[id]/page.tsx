// src/app/users/[id]/page.tsx
import { getUserDetails, getUserPosts, getUserTodos } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/features/BackButton";
import { Building, MapPin, Phone, Mail, Globe, CheckCircle2, Circle } from "lucide-react";

// BONUS: Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await getUserDetails(id);
    return {
      title: `${user.name} (@${user.username}) | Mampu Directory`,
      description: `View profile, posts, and tasks for ${user.name} from ${user.company.name}.`,
    };
  } catch {
    return { title: "User Not Found" };
  }
}

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Parallel Data Fetching for maximum performance
  const [user, posts, todos] = await Promise.all([
    getUserDetails(id),
    getUserPosts(id),
    getUserTodos(id)
  ]);

  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = todos.length - completedTodos;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />

      {/* User Info Card */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 pb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900">{user.name}</CardTitle>
              <p className="text-gray-500 font-medium mt-1">@{user.username}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-50">
                {posts.length} Posts
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-orange-50 text-orange-700 hover:bg-orange-50">
                {pendingTodos} Pending Tasks
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Details</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gray-400"/> {user.email}</div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-gray-400"/> {user.phone}</div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400"/>
                <a href={`https://${user.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {user.website}
                </a>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Work & Location</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-gray-400 shrink-0 mt-0.5"/> 
                <div>
                  <p className="font-medium text-gray-900">{user.company.name}</p>
                  <p className="text-gray-500 italic">&quot;{user.company.catchPhrase}&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5"/> 
                <p>{user.address.suite}, {user.address.street},<br/>{user.address.city}, {user.address.zipcode}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts and Todos Workspace */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="todos">Tasks & Todos ({todos.length})</TabsTrigger>
          <TabsTrigger value="posts">Published Posts ({posts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="space-y-4">
          <div className="bg-white border rounded-lg shadow-sm divide-y">
            {todos.map(todo => (
              <div key={todo.id} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                )}
                <p className={`text-sm ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900 font-medium'}`}>
                  {todo.title}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {posts.map(post => (
            <Card key={post.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900 capitalize">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">{post.body}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}
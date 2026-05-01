import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDetails() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <Skeleton className="h-10 w-32" /> {/* Back button */}
      <Skeleton className="h-64 w-full rounded-xl" /> {/* Profile Card */}
      <Skeleton className="h-10 w-full" /> {/* Tabs */}
      <Skeleton className="h-96 w-full rounded-xl" /> {/* Content Area */}
    </div>
  );
}
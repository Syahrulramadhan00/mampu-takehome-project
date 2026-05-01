"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorDetails({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
      <h2 className="text-2xl font-bold text-gray-900">User Not Found</h2>
      <p className="text-gray-500">We could not load this profile. The user might not exist or the server is unreachable.</p>
      <Button onClick={() => reset()} variant="outline">Try Again</Button>
    </div>
  );
}
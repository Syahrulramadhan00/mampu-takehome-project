"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button 
      variant="ghost" 
      onClick={() => router.back()} 
      className="mb-6 -ml-4 text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to list
    </Button>
  );
}
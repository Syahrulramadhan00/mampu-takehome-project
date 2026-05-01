"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="text-red-500 font-semibold text-lg">Something went wrong!</div>
      <p className="text-gray-500 text-sm max-w-md text-center">
        We could not load the users. Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
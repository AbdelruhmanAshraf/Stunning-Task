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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090a10] text-white p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-slate-400 max-w-md mb-6">
        An unexpected error occurred while rendering the workspace.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

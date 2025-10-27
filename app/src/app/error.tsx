"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Something went wrong</h1>
        <p className="opacity-70 mb-6">{error?.message ?? "Unknown error"}</p>
        <button
          onClick={() => reset()}
          className="rounded-lg px-4 py-2 border"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
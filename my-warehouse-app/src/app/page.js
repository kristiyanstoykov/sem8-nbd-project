"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/items"
          className="flex w-48 h-48 bg-blue-500 hover:bg-blue-400 rounded-lg items-center justify-center text-center"
        >
          Go to Items Page
        </Link>
        <Link
          href="/products"
          className="flex w-48 h-48 bg-blue-500 hover:bg-blue-400 rounded-lg items-center justify-center text-center"
        >
          Go to Products Page
        </Link>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import ProductsCard from "../components/ProductsCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <ProductsCard />
    </div>
  );
}

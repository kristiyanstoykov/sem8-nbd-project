"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Fix: Use useParams() in Next.js 13+
import ProductsSingle from "../../../components/ProductsSingle";

export default function ProductDetails() {
  const { id } = useParams(); // Get dynamic product ID
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Prevent fetch if ID is missing

    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        console.log("response", response);
        if (!response.ok) throw new Error("Failed to fetch product");

        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center">Product not found</p>;

  return (
    <div className="container mx-auto p-4 max-w-[850px]">
      <button onClick={() => router.back()} className="text-blue-200 mb-4">
        &larr; Back to Products
      </button>

      <ProductsSingle product={product} />
    </div>
  );
}

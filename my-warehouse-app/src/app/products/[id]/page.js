"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import ProductsSingle from "../../../components/ProductsSingle";

export default function ProductDetails() {
  const { id } = useParams(); // Get dynamic product ID
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Prevent fetch if ID is missing

    setLoading(true);
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
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

  return (
    <div className="container mx-auto p-4 mt-28 mb-28 max-w-[850px]">
      <button onClick={() => router.back()} className="text-blue-200 mb-4">
        &larr; Back to Products
      </button>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>{" "}
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Image
            src="/loader-animation.gif"
            alt="Loading..."
            width={100}
            height={100}
          />
        </div>
      ) : !product ? (
        <p className="text-center text-gray-500">No product found.</p>
      ) : (
        <ProductsSingle product={product} />
      )}
    </div>
  );
}

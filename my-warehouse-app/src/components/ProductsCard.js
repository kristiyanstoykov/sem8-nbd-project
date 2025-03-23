"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProductsCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        // Check if data.products exists before setting state
        if (data && data.products) {
          setProducts(data.products);
        } else {
          console.error("API response missing products array:", data);
          setProducts([]);
          setError("Invalid response format from server");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setError("Failed to fetch products");
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Current Products</h2>
        <select
          className="border rounded p-2 text-black"
          onChange={(e) => console.log("Sort by:", e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Sort by
          </option>
          <option value="default">Default</option>
          <option value="name">Name</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-black">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-stone-200 rounded-lg text-center"
            >
              <Link
                href={`/products/${product._id}`}
                className="shadow hover:shadow-md transition-shadow block"
              >
                <div className="relative w-full pt-[100%]">
                  <Image
                    src={product.thumbnail_guid || "/product-placeholder.jpeg"}
                    alt={product.name}
                    fill
                    className="absolute inset-0 object-contain rounded-lg p-2"
                  />
                </div>
              </Link>
              <h3 className="p-1 font-semibold">{product.name}</h3>
              <p className="p-1">${product.price}</p>
              <p className="p-1 text-sm">Quantity: {product.stock}</p>
              <button
                className="mb-6 bg-green-500 py-2 rounded hover:bg-green-600 mt-2 min-w-[100px]"
                onClick={() => {}}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found. Add your first one!</p>
      )}
    </div>
  );
}

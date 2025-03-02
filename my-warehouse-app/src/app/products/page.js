"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Products() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, stock }),
      });

      if (response.ok) {
        // Refresh products
        const refreshResponse = await fetch("/api/products");
        const data = await refreshResponse.json();
        if (data && data.products) {
          setProducts(data.products);
        }

        // Clear form
        setName("");
        setPrice("");
        setStock("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setError("An error occurred while adding the item");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products List</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block mb-1">
              Price:
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="stock" className="block mb-1">
              Quantity:
            </label>
            <input
              type="number"
              pattern="[0-9]*"
              step="1"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border p-2 w-full text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Current Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found. Add your first one!</p>
        )}
      </div>

      <div className="mt-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

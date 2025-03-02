"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [descritpion, setDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch("/api/items");
        const data = await response.json();

        // Check if data.items exists before setting state
        if (data && data.items) {
          setItems(data.items);
        } else {
          console.error("API response missing items array:", data);
          setItems([]);
          setError("Invalid response format from server");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
        setError("Failed to fetch items");
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, descritpion }),
      });

      if (response.ok) {
        // Refresh items
        const refreshResponse = await fetch("/api/items");
        const data = await refreshResponse.json();
        if (data && data.items) {
          setItems(data.items);
        }

        // Clear form
        setName("");
        setDescription("");
        setError(null);
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
      <h1 className="text-2xl font-bold mb-4">Items List</h1>

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
            <label htmlFor="description" className="block mb-1">
              Description:
            </label>
            <textarea
              id="description"
              value={descritpion}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full text-gray-900"
              rows="3"
              required
            ></textarea>
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
        <h2 className="text-xl font-semibold mb-2">Current Items</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item._id} className="border p-4 rounded shadow-md">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600">{item.descritpion}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No items found. Add your first one!</p>
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

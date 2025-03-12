"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState(null);

  const handleImageChange = async (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        setImage(e.target.files[0]);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setError("Failed to upload image");
    }
  };

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

    // Prepare product data to send to the server
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);

    // If an image has been uploaded, include the image URL in the product data
    if (image) {
      formData.append("file", image);
    }

    try {
      // Send product data to API
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const refreshResponse = await fetch("/api/products");
        const data = await refreshResponse.json();
        if (data && data.products) {
          setProducts(data.products);
        }

        // Clear form after successful submission
        setName("");
        setPrice("");
        setStock("");
        // Reset image state
        setImage(null);
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-8 justify-items-center">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <form
          onSubmit={handleSubmit}
          className="justify-center space-y-4 min-w-96 max-w-screen-sm"
        >
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

          {/* Upload Image Section */}
          <div>
            <label htmlFor="thumbnail" className="block mb-1">
              Upload Image:
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 w-full text-white"
            />
            {image && (
              <img
                className="mt-2 w-32 h-32 object-cover rounded border"
                alt="preview"
                width={250}
                src={URL.createObjectURL(image)}
              />
            )}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-black">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-stone-200 rounded-lg text-center"
              >
                <Link
                  href={`/product/${product._id}`}
                  className="shadow hover:shadow-md transition-shadow block"
                >
                  <div className="relative w-full pt-[100%]">
                    <Image
                      src={
                        product.thumbnail_guid || "/product-placeholder.jpeg"
                      }
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

      <div className="mt-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

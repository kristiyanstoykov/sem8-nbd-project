"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    thumbnail_guid: "",
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product);
        setFormData({
          name: data.product.name || "",
          price: data.product.price || "",
          stock: data.product.stock || "",
          thumbnail_guid: data.product.thumbnail_guid || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load product:", err);
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      const result = await res.json();
      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  if (loading) return <p>Loading product data...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <>
      <Link
        href="#"
        onClick={() => {
          if (
            confirm(
              "Unsaved changes will be lost. Are you sure you want to go back?"
            )
          ) {
            router.back();
          }
        }}
        className="text-blue-200 underline hover:text-blue-500 mb-4"
      >
        Back to products
      </Link>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-black">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded p-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1">Price ($):</label>
            <input
              type="number"
              name="price"
              className="w-full border rounded p-2"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1">Stock Quantity:</label>
            <input
              type="number"
              name="stock"
              className="w-full border rounded p-2"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block mb-1">Thumbnail URL:</label>
            <input
              readOnly={true}
              type="text"
              name="thumbnail_guid"
              className="w-full border rounded p-2"
              value={formData.thumbnail_guid}
              onChange={handleChange}
            />
          </div>

          {/* Image preview */}
          {formData.thumbnail_guid && (
            <div className="mt-2">
              <Image
                src={formData.thumbnail_guid}
                alt="Preview"
                width={150}
                height={150}
                className="object-contain rounded"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}

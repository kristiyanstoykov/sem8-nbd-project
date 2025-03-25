"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProductsCardAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || ""
  );
  const [localSort, setLocalSort] = useState(searchParams.get("sort") || "");

  function applyFilters() {
    const params = new URLSearchParams();
    if (localSearch) params.set("search", localSearch);
    if (localSort) params.set("sort", localSort);
    router.push(`?${params.toString()}`);
  }

  function clearFilters() {
    setLocalSearch("");
    setLocalSort("");
    router.push("?");
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const sort = searchParams.get("sort") || "default";
        const search = searchParams.get("search") || "";

        const response = await fetch(
          `/api/products?sort=${sort}&search=${search}`
        );
        const data = await response.json();

        if (data && data.products) {
          setProducts(data.products);
        } else {
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
  }, [searchParams]);

  return (
    <div className="container pt-4 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <Link href="/admin/products/add">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-800">
            Add Product
          </Button>
        </Link>
        <div className="flex items-stretch flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex items-center w-full md:w-auto">
            <span className="absolute left-2 text-gray-500">
              <Image
                src="/search.png"
                alt="Search Icon"
                width={20}
                height={20}
              />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="border rounded pl-8 pr-2 py-2 w-full md:w-auto text-black"
              onChange={(e) => setLocalSearch(e.target.value)}
              value={localSearch}
            />
          </div>
          <select
            className="border rounded p-2 text-black"
            onChange={(e) => setLocalSort(e.target.value)}
            value={localSort}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <Button
            className="bg-gray-200 text-black hover:bg-blue-200 h-full"
            onClick={applyFilters}
          >
            Search
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-600 h-full"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Image
            src="/loader-animation.gif"
            alt="Loading..."
            width={100}
            height={100}
          />
        </div>
      ) : products && products.length > 0 ? (
        <div className="flex flex-col gap-4 text-black">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between bg-stone-100 rounded-lg shadow p-4"
            >
              {/* Product image */}
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={product.thumbnail_guid || "/product-placeholder.jpeg"}
                  alt={product.name}
                  fill
                  className="object-contain rounded"
                />
              </div>

              {/* Product details */}
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-700">${product.price}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {product.stock}
                </p>
              </div>

              {/* Edit / Delete icons */}
              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={() =>
                    router.push(`/admin/products/edit/${product._id}`)
                  }
                  className="hover:scale-125 transition-transform duration-200"
                >
                  <Image
                    src="/icons/edit.png"
                    alt="Edit"
                    width={32}
                    height={32}
                  />
                </button>
                <button
                  onClick={() => console.log("Delete", product._id)}
                  className="hover:scale-125 transition-transform duration-200"
                >
                  <Image
                    src="/icons/delete.png"
                    alt="Delete"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found. Add your first one!</p>
      )}
    </div>
  );
}

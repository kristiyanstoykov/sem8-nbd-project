"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProductsCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // 🟡 Store search & sort inputs locally
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
  }, [searchParams]); // 👈 This will now only change when user clicks "Search"

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-2">
        <h2 className="text-xl font-semibold">Current Products</h2>
        <div className="flex items-stretch flex-col md:flex-row gap-2 w-full md:w-auto">
          {/* Search input */}
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

          {/* Sort dropdown */}
          <select
            className="border rounded p-2 text-black"
            onChange={(e) => setLocalSort(e.target.value)}
            value={localSort}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>

          {/* Search button */}
          <Button
            className="border-blue-300 rounded p-2 bg-gray-200 text-black hover:bg-blue-200 h-[100%]"
            onClick={applyFilters}
          >
            Search
          </Button>

          {/* Clear button */}
          <Button
            className="border-none rounded p-2 bg-red-500 text-white hover:bg-red-600 h-[100%]"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Products grid */}
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

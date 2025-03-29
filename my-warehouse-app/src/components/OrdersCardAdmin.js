"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function OrdersCardAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const params = new URLSearchParams();
        const status = searchParams.get("status");
        if (status) params.set("status", status);

        const res = await fetch(`/api/orders?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load orders");

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [searchParams]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    router.push(`?${params.toString()}`);
  }

  function clearFilters() {
    setStatusFilter("");
    router.push("?");
  }

  return (
    <div className="container pt-4 pb-4 text-black">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <Link href="/admin/orders/add">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-800">
            Create Order
          </Button>
        </Link>
        <div className="flex items-stretch flex-col md:flex-row gap-2 w-full md:w-auto">
          <select
            className="border rounded p-2 text-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <Button
            className="bg-gray-200 text-black hover:bg-blue-200 h-full"
            onClick={applyFilters}
          >
            Filter
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
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">Client</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-blue-600 underline"
                    >
                      #{order._id}
                    </Link>
                  </td>
                  <td className="p-3">
                    {order.user_name || order.client_id || "Unknown"}
                  </td>
                  <td className="p-3 capitalize">{order.status}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          router.push(`/admin/orders/edit/${order._id}`)
                        }
                        className="hover:scale-110 transition-transform"
                      >
                        <Image
                          src="/icons/edit.png"
                          alt="Edit"
                          width={24}
                          height={24}
                        />
                      </button>
                      <button
                        onClick={() => console.log("Delete", order._id)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Image
                          src="/icons/delete.png"
                          alt="Delete"
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-500">No orders found.</p>
      )}
    </div>
  );
}

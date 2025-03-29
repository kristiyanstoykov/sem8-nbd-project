"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UsersCardAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (role) params.set("role", role);

        const res = await fetch(`/api/users?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load users");

        setUsers(data.users || []);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Unknown error");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [searchParams]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (role) params.set("role", role);
    router.push(`?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setRole("");
    router.push("?");
  }

  function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            alert("User deleted successfully!");
            setUsers(users.filter((user) => user._id !== userId));
          } else {
            alert(data.error || "Failed to delete user");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          alert("Failed to delete user");
        });
    }
  }

  return (
    <div className="container pt-4 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <Link href="/admin/users/add">
          <Button className="bg-emerald-600 text-white hover:bg-emerald-800">
            Add User
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row items-stretch gap-2 w-full md:w-auto">
          {/* Search */}
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
              placeholder="Search users..."
              className="border rounded pl-8 pr-2 py-2 w-full text-black"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>

          {/* Role Filter */}
          <select
            className="border rounded p-2 text-black"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
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
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : users.length > 0 ? (
        <div className="flex flex-col gap-4 text-black">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-stone-100 rounded-lg shadow p-4"
            >
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-gray-700">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize">
                  Role: {user.role}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push(`/admin/users/edit/${user._id}`)}
                  className="hover:scale-125 transition-transform"
                >
                  <Image
                    src="/icons/edit.png"
                    alt="Edit"
                    width={32}
                    height={32}
                  />
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="hover:scale-125 transition-transform"
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
        <p className="text-red-600">No users found.</p>
      )}
    </div>
  );
}

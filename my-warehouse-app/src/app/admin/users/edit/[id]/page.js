"use client";

import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user:", err);
        setLoading(false);
      }
    }

    if (id) {
      fetchUser();
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Update failed");

      alert(result.message || "User updated successfully!");
      redirect("/admin/users");
    } catch (error) {
      alert(error.message || "Error updating user.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Image
            src="/loader-animation.gif"
            alt="Loading..."
            width={100}
            height={100}
          />
        </div>
      ) : (
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
            Back to users
          </Link>
          {!user ? (
            <div className="text-red-500 text-center">
              <h2 className="text-2xl font-semibold">User not found</h2>
              <p>Please check the user ID and try again.</p>
            </div>
          ) : (
            <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-black">
              <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
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

                {/* Email */}
                <div>
                  <label className="block mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border rounded p-2"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block mb-1">Role:</label>
                  <select
                    name="role"
                    className="w-full border rounded p-2"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
}

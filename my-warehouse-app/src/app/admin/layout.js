import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export default async function AdminLayout({ children }) {
  const fullUser = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: true,
  });

  if (!fullUser || fullUser.role !== "admin") {
    console.log("User is not an admin");
    redirect("/404");
  }

  const headersList = await headers();
  let pathname = headersList.get("referer") || "";
  pathname = pathname.split("/").pop();

  const linkClass = (path) =>
    `block hover:bg-purple-950 p-2 rounded transition ${
      pathname.includes(path)
        ? "bg-purple-950 font-semibold underline underline-offset-4"
        : ""
    }`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-5 font-sans gap-4">
      <nav className="w-full md:w-64 max-w-xs bg-slate-100 text-black p-4 rounded-lg mb-5 md:mb-0">
        <ul className="text-lg space-y-1">
          <li>
            <Link
              href="/admin"
              className="block hover:bg-stone-300 p-2 rounded transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/products"
              className="block hover:bg-stone-300 p-2 rounded transition"
            >
              Manage Products
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className="block hover:bg-stone-300 p-2 rounded transition"
            >
              Manage Users
            </Link>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className="block hover:bg-stone-300 p-2 rounded transition"
            >
              Manage Orders
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}

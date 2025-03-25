import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export default async function AdminLayout({ children }) {
  const fullUser = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: true,
  });

  if (!fullUser || fullUser.role != "admin") {
    console.log("User is not an admin");
    redirect("/404");
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const linkClass = (path) =>
    `block hover:bg-purple-950 p-2 rounded ${
      pathname === path || pathname.startsWith(path + "/")
        ? "font-semibold underline underline-offset-4"
        : ""
    }`;

  return (
    <div className="flex min-h-screen p-5 font-sans">
      <div className="w-64 max-w-xs bg-blue-900 text-white p-4 rounded-lg">
        <ul className="text-lg space-y-1">
          <li>
            <Link href="/admin/" className={linkClass("/admin")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/products"
              className={`block hover:bg-purple-950 p-2 rounded ${
                pathname.startsWith("/admin/products")
                  ? "font-semibold underline underline-offset-4"
                  : ""
              }`}
            >
              Manage Products
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={linkClass("/admin/users")}>
              Manage Users
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className={linkClass("/admin/orders")}>
              Manage Orders
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 ml-5">{children}</div>
    </div>
  );
}

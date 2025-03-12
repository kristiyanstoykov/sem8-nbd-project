import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="logo">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 transition-colors flex items-center"
        >
          <Image
            src="/logo-nobg.png"
            alt="Company Logo"
            width={50}
            height={50}
          />
          <h1 className="text-xl font-bold text-blue-600 ml-2">MyWarehouse</h1>
        </Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              href="/suppliers"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Suppliers
            </Link>
          </li>
          <li>
            <Link
              href="/reports"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Reports
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex space-x-3">
        <Button asChild>
          <Link
            href="/sign-in"
            className="  px-3 py-1 bg-blue-600 hover:text-black text-white rounded hover:bg-blue-200 transition-colors"
          >
            Sign in
          </Link>
        </Button>
        <Button asChild>
          <Link
            href="/sign-up"
            className="px-3 py-1 bg-emerald-600 hover:text-black text-white rounded hover:bg-emerald-200 transition-colors"
          >
            Sign up
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;

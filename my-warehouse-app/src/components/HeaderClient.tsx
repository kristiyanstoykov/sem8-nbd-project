"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";

export default function HeaderClient({ fullUser }: { fullUser: any }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center relative z-30">
      {/* Left side: Logo */}
      <div className="flex items-center">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 transition-colors flex items-center"
        >
          <Image
            src="/logo-nobg.png"
            alt="Company Logo"
            width={40}
            height={40}
          />
          <h1 className="text-xl font-bold text-blue-600 ml-2">MyWarehouse</h1>
        </Link>
      </div>

      {/* Nav links */}
      <nav
        className={`${
          menuOpen ? "block" : "hidden"
        } absolute top-full ms-12 w-full bg-white shadow-md md:shadow-none md:bg-transparent md:static md:flex md:items-center md:space-x-6 z-20`}
      >
        <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0">
          {["Dashboard", "Products", "Orders", "Suppliers", "Reports"].map(
            (label) => (
              <li key={label}>
                <Link
                  href={`/${label.toLowerCase()}`}
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Right side: Profile icon + Hamburger */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          {/* Profile icon (only if logged in) */}

          {/* Hamburger button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* User Buttons */}
        <div className="md:flex space-x-3 items-center">
          {fullUser ? (
            <Link
              href="/my-profile"
              className="flex items-center hover:scale-110 transform duration-200 min-w-[32px]"
            >
              <Image
                src="/my-profile.png"
                alt="Profile Icon"
                width={32}
                height={32}
                className="rounded-full border border-gray-300"
              />
            </Link>
          ) : (
            <>
              <Button
                className="px-3 py-1 bg-blue-600 hover:text-black text-white rounded hover:bg-blue-200 transition-colors"
                asChild
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                className="px-3 py-1 bg-emerald-600 hover:text-black text-white rounded hover:bg-emerald-200 transition-colors"
                asChild
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

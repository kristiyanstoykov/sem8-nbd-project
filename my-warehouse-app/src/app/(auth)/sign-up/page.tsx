"use client";

import { SignUpForm } from "@/auth/nextjs/components/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SignUp() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `relative group pb-1 ${
      pathname === path ? "font-semibold underline underline-offset-4" : ""
    }`;

  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card className="border-none bg-transparent">
        <CardHeader>
          <CardTitle className="hidden">Sign Up</CardTitle>
          <div className="flex space-x-4 p-4 bg-white">
            <Link href="/sign-up" className={linkClass("/sign-up")}>
              Sign Up
            </Link>
            <Link href="/sign-in" className={linkClass("/sign-in")}>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
              Sign In
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <SignUpForm theme="light" />
        </CardContent>
      </Card>
    </div>
  );
}

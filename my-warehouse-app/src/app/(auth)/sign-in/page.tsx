"use client";

import { SignInForm } from "../../../auth/nextjs/components/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const pathname = usePathname();

  const [state, setState] = React.useState<{ oauthError?: string }>({});
  React.useEffect(() => {
    searchParams.then(setState);
  }, [searchParams]);

  const { oauthError } = state;

  const linkClass = (path: string) =>
    `relative group pb-1 ${
      pathname === path ? "font-semibold underline underline-offset-4" : ""
    }`;

  return (
    <div className="container mx-auto p-4 max-w-[750px]">
      <Card className="border-none bg-transparent">
        <CardHeader>
          <CardTitle className="hidden">Sign In</CardTitle>
          {oauthError && (
            <CardDescription className="text-destructive">
              {oauthError}
            </CardDescription>
          )}
          <div className="flex space-x-4 p-4 bg-white">
            <Link href="/sign-up" className={linkClass("/sign-up")}>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
              Sign Up
            </Link>
            <Link href="/sign-in" className={linkClass("/sign-in")}>
              Sign In
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <SignInForm theme="light" />
        </CardContent>
      </Card>
    </div>
  );
}

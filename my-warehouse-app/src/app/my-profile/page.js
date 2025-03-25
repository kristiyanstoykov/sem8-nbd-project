import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { LogOutButton } from "@/auth/nextjs/components/LogOutButton";
import { Button } from "@/components/ui/button";

export default async function MyProfilePage() {
  const fullUser = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: true,
  });

  return (
    <div className="container my-auto mx-auto py-20 px-4 max-w-[550px]">
      <Card className="flex flex-col items-center">
        <CardHeader>
          <CardTitle className="text-xl">Hello!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div>
            <Image
              src="/my-profile.png"
              alt="Profile Icon"
              width={128}
              height={128}
              className="rounded-full border border-gray-300"
            />
          </div>
          <p className="mt-3 p-1">{fullUser.id}</p>
          <p className="p-1">{fullUser.name}</p>
          <p className="p-1">{fullUser.email}</p>
          <p className="p-1">{fullUser.role}</p>
        </CardContent>
        <CardFooter className="flex items-baseline gap-2 space-y-4">
          {fullUser.role === "admin" ? (
            <Link href="/admin">
              <Button className="bg-blue-300 text-black hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition duration-300">
                Admin Dashboard
              </Button>
            </Link>
          ) : null}
          <LogOutButton />
        </CardFooter>
      </Card>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
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

export default async function MyProfilePage() {
  const fullUser = await getCurrentUser();

  if (!fullUser) {
    redirect("/sign-in");
  }

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
          <p className="p-1">John Doe</p>
          <p className="p-1">john.doe@example.com</p>
          <p className="p-1">{fullUser.role}</p>
        </CardContent>
        <CardFooter>
          <LogOutButton />
        </CardFooter>
      </Card>
    </div>
  );
}

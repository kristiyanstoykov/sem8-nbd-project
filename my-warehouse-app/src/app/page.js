import Link from "next/link";
import ProductsCard from "../components/ProductsCard";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function Home() {
  const fullUser = await getCurrentUser();
  return (
    <>
      {fullUser && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome {fullUser.id}!</CardTitle>
            <CardDescription>
              <p>
                You are currently logged in as <strong>{fullUser.role}</strong>
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      )}
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <ProductsCard />
      </div>
    </>
  );
}

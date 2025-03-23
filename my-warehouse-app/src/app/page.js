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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <ProductsCard />
      </div>
    </>
  );
}

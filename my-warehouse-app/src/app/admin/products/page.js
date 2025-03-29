import ProductsCardAdmin from "@/components/ProductsCardAdmin";

export const metadata = {
  title: "Manage Products",
};

export default function ManageProductsPage() {
  return (
    <>
      <h1 className="text-white text-2xl font-bold mb-4">Manage products</h1>
      <ProductsCardAdmin />
    </>
  );
}

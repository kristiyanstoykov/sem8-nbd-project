import OrdersCardAdmin from "@/components/OrdersCardAdmin";

export const metadata = {
  title: "Manage Orders",
};

export default function ManageOrdersPage() {
  return (
    <>
      <h1 className="text-white text-2xl font-bold mb-4">Manage orders</h1>
      <p className="text-white mb-4">
        Here you can add, edit or delete orders.
      </p>
      <OrdersCardAdmin />
    </>
  );
}

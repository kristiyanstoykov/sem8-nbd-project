import UsersCardAdmin from "@/components/UsersCardAdmin";

export const metadata = {
  title: "Manage Users",
};

export default function ManageUsersPage() {
  return (
    <>
      <h1 className="text-white text-2xl font-bold mb-4">Manage users</h1>
      <UsersCardAdmin />
    </>
  );
}

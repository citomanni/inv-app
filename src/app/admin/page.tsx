import { redirect } from "next/navigation";

const AdminPage = async () => {
  redirect("/admin/kyc");
};

export default AdminPage;

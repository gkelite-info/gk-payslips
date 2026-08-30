import { createClient } from "@/utils/supabase/server";
import { getEmployees } from "@/lib/helpers/getEmployees";
import EmployeesClient from "./EmployeesClient";

export const metadata = {
  title: "Employees | Dashboard",
  description: "Manage your workforce, roles, and statuses.",
};

export default async function EmployeesPage() {
  const supabase = await createClient();
  const initialData = await getEmployees(supabase, 0);

  return <EmployeesClient initialData={initialData} />;
}

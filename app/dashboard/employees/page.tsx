import { createClient } from "@/utils/supabase/server";
import { getEmployees } from "@/lib/helpers/getEmployees";
import EmployeesClient from "./EmployeesClient";

export const metadata = {
  title: "Employees | Dashboard",
  description: "Manage your workforce, roles, and statuses.",
};

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const initialData = await getEmployees(supabase, 0, search);

  return <EmployeesClient initialData={initialData} search={search} />;
}

import { createClient } from "@/utils/supabase/server";
import { getEmployeeFinancials } from "@/lib/helpers/employeeFinancials";
import EmployeeFinancialsClient from "./EmployeeFinancialsClient";

export default async function EmployeeFinancialsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const initialData = await getEmployeeFinancials(supabase, resolvedParams.id);

  return <EmployeeFinancialsClient employeeId={resolvedParams.id} initialData={initialData} />;
}

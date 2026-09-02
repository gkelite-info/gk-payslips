import { createClient } from "@/utils/supabase/server";
import { getEmployeePayslips } from "@/lib/helpers/employeePayslips";
import EmployeePayslipsClient from "./EmployeePayslipsClient";

export default async function EmployeePayslipsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const initialData = await getEmployeePayslips(supabase, resolvedParams.id);

  return <EmployeePayslipsClient employeeId={resolvedParams.id} initialData={initialData} />;
}

import { createClient } from "@/utils/supabase/server";
import { getEmployeeSalaryPayments } from "@/lib/helpers/getEmployeeSalaryPayments";
import EmployeeSalaryPaymentsClient from "./EmployeeSalaryPaymentsClient";

export default async function EmployeeSalaryPaymentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const initialData = await getEmployeeSalaryPayments(supabase, resolvedParams.id, 0, 12);

  return <EmployeeSalaryPaymentsClient employeeId={resolvedParams.id} initialData={initialData} />;
}

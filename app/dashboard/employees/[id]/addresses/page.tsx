import { createClient } from "@/utils/supabase/server";
import { getEmployeeAddresses } from "@/lib/helpers/getEmployeeAddresses";
import EmployeeAddressesClient from "./EmployeeAddressesClient";

export default async function EmployeeAddressesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const initialData = await getEmployeeAddresses(supabase, resolvedParams.id);

  return <EmployeeAddressesClient employeeId={resolvedParams.id} initialData={initialData} />;
}

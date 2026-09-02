"use client";

import { useQuery } from "@tanstack/react-query";
import { getEmployeeFinancials, EmployeeFinancialUI } from "@/lib/helpers/employeeFinancials";
import { supabase } from "@/lib/supabaseClient";

export function useGetEmployeeFinancials(employeeId: string, initialData?: EmployeeFinancialUI | null) {
  return useQuery({
    queryKey: ["employeeFinancials", employeeId],
    queryFn: async () => {
      const data = await getEmployeeFinancials(supabase, employeeId);
      return data;
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}

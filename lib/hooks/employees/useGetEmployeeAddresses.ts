"use client";

import { useQuery } from "@tanstack/react-query";
import { getEmployeeAddresses, EmployeeAddressUI } from "@/lib/helpers/employeeAddresses";
import { supabase } from "@/lib/supabaseClient";

export function useGetEmployeeAddresses(employeeId: string, initialData?: EmployeeAddressUI[]) {
  return useQuery({
    queryKey: ["employeeAddresses", employeeId],
    queryFn: async () => {
      const data = await getEmployeeAddresses(supabase, employeeId);
      return data;
    },
    initialData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

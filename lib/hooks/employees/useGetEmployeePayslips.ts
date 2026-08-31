"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getEmployeePayslips, EmployeePayslipUI } from "@/lib/helpers/getEmployeePayslips";
import { supabase } from "@/lib/supabaseClient";

export function useGetEmployeePayslips(employeeId: string, initialData?: { data: EmployeePayslipUI[], nextCursor: number | undefined }) {
  return useInfiniteQuery({
    queryKey: ["employeePayslips", employeeId],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await getEmployeePayslips(supabase, employeeId, pageParam as number, 12);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData ? { pages: [initialData], pageParams: [0] } : undefined,
    staleTime: 5 * 60 * 1000,
  });
}

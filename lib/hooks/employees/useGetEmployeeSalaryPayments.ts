"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getEmployeeSalaryPayments, EmployeeSalaryPaymentUI } from "@/lib/helpers/getEmployeeSalaryPayments";
import { supabase } from "@/lib/supabaseClient";

export function useGetEmployeeSalaryPayments(employeeId?: string, initialData?: { data: EmployeeSalaryPaymentUI[], nextCursor: number | undefined }) {
  return useInfiniteQuery({
    queryKey: ["employeeSalaryPayments", employeeId || "all"],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await getEmployeeSalaryPayments(supabase, employeeId, pageParam as number, 100);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData ? { pages: [initialData], pageParams: [0] } : undefined,
    staleTime: 5 * 60 * 1000,
  });
}

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getEmployees, EmployeeUI } from "@/lib/helpers/employees";
import { supabase } from "@/lib/supabaseClient";

export function useGetEmployees(initialData?: { data: EmployeeUI[], nextCursor: number | undefined }, search: string = "") {
  return useInfiniteQuery({
    queryKey: ["employees", search],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await getEmployees(supabase, pageParam as number, search);
      return data;
    },
    initialPageParam: 0,
    initialData: initialData ? {
      pages: [initialData],
      pageParams: [0],
    } : undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

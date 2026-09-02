"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/helpers/users";

export function useGetUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const data = await getUser();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

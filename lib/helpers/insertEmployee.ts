import { SupabaseClient } from "@supabase/supabase-js";

export const insertEmployee = async (
  supabase: SupabaseClient,
  data: {
    employeeId: string;
    employeeSerialNo: string;
    userId: string;
    joinedAt: string;
    shift: string;
    employmentType: string;
    status: string;
    probationEndDate?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    createdAt: string;
    updatedAt: string;
  }
) => {
  const { error } = await supabase
    .from('employees')
    .insert(data);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

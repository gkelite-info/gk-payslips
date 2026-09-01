import { SupabaseClient } from "@supabase/supabase-js";

export const updateEmployee = async (
  supabase: SupabaseClient,
  employeeId: string,
  data: {
    employeeSerialNo: string;
    joinedAt: string;
    shift: string;
    employmentType: string;
    status: string;
    probationEndDate?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    designation?: string | null;
    updatedAt: string;
  }
) => {
  const { error } = await supabase
    .from('employees')
    .update(data)
    .eq('employeeId', employeeId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

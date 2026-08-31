import { SupabaseClient } from "@supabase/supabase-js";

export const deleteEmployee = async (
  supabase: SupabaseClient,
  userId: string,
  employeeId: string
) => {
  const { error: userError } = await supabase
    .from('users')
    .update({ isActive: false, updatedAt: new Date().toISOString() })
    .eq('userId', userId);

  if (userError) {
    throw new Error("Failed to remove user account: " + userError.message);
  }

  const { error: empError } = await supabase
    .from('employees')
    .update({ status: 'alumni', updatedAt: new Date().toISOString() })
    .eq('employeeId', employeeId);

  if (empError) {
    throw new Error("Failed to update employee status: " + empError.message);
  }

  return true;
};

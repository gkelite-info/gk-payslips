import { SupabaseClient } from "@supabase/supabase-js";

export const insertEmployeeAddress = async (
  supabase: SupabaseClient,
  data: {
    employeeAddressId: string;
    employeeId: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    addressType: string;
    createdAt: string;
    updatedAt: string;
  }
) => {
  const { error } = await supabase
    .from('employee_addresses')
    .insert(data);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

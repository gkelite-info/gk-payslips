import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeeAddressUI {
  id: string;
  employeeId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: string;
  createdAt: string;
}

export async function getEmployeeAddresses(
  supabase: SupabaseClient,
  employeeId: string
): Promise<EmployeeAddressUI[]> {
  const { data, error } = await supabase
    .from('employee_addresses')
    .select('*')
    .eq('employeeId', employeeId)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data.map((addr: any) => ({
    id: addr.employeeAddressId,
    employeeId: addr.employeeId,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    zipCode: addr.zipCode,
    country: addr.country,
    addressType: addr.addressType,
    createdAt: addr.createdAt,
  }));
}


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


import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeeFinancialUI {
  id: string;
  employeeId: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  panNumber: string | null;
  aadhaarNumber?: string | null;
  uanNumber?: string | null;
  basicSalary: number;
  houseRentAllowance: number;
  transportationAllowance: number;
  telephoneAllowance: number;
  statutoryBonus: number;
  specialAllowance: number;
  companyDeduction: number;
  createdAt: string;
}

export async function getEmployeeFinancials(
  supabase: SupabaseClient,
  employeeId: string
): Promise<EmployeeFinancialUI | null> {
  const { data, error } = await supabase
    .from('employee_financials')
    .select('*')
    .eq('employeeId', employeeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    id: data.employeeFinancialId,
    employeeId: data.employeeId,
    bankName: data.bankName,
    bankAccountNumber: data.bankAccountNumber,
    bankIfscCode: data.bankIfscCode,
    panNumber: data.panNumber,
    aadhaarNumber: data.aadhaarNumber,
    uanNumber: data.uanNumber,
    basicSalary: data.basicSalary,
    houseRentAllowance: data.houseRentAllowance,
    transportationAllowance: data.transportationAllowance,
    telephoneAllowance: data.telephoneAllowance,
    statutoryBonus: data.statutoryBonus,
    specialAllowance: data.specialAllowance,
    companyDeduction: data.companyDeduction,
    createdAt: data.createdAt,
  };
}

export const upsertEmployeeFinancials = async (
  supabase: SupabaseClient,
  data: {
    employeeFinancialId: string;
    employeeId: string;
    bankName: string;
    bankAccountNumber: string;
    bankIfscCode: string;
    panNumber?: string | null;
    aadhaarNumber?: string | null;
    uanNumber?: string | null;
    basicSalary: number;
    houseRentAllowance: number;
    transportationAllowance: number;
    telephoneAllowance: number;
    statutoryBonus: number;
    specialAllowance: number;
    companyDeduction: number;
    createdAt: string;
    updatedAt: string;
  }
) => {
  const { data: existing, error: fetchError } = await supabase
    .from('employee_financials')
    .select('employeeFinancialId')
    .eq('employeeId', data.employeeId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  const cleanData = {
    ...data,
    panNumber: data.panNumber?.trim() || null,
    aadhaarNumber: data.aadhaarNumber?.trim() || null,
    uanNumber: data.uanNumber?.trim() || null,
  };

  if (existing) {
    const updateData = { ...cleanData };
    // @ts-ignore
    delete updateData.employeeFinancialId;
    // @ts-ignore
    delete updateData.createdAt;

    const { error } = await supabase
      .from('employee_financials')
      .update(updateData)
      .eq('employeeFinancialId', existing.employeeFinancialId);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('employee_financials')
      .insert(cleanData);

    if (error) throw new Error(error.message);
  }

  return true;
};

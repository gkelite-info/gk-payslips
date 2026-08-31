import { SupabaseClient } from "@supabase/supabase-js";

export const upsertEmployeeFinancials = async (
  supabase: SupabaseClient,
  data: {
    employeeFinancialId: string;
    employeeId: string;
    bankName: string;
    bankAccountNumber: string;
    bankIfscCode: string;
    panNumber: string;
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

  if (existing) {
    const updateData = { ...data };
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
      .insert(data);

    if (error) throw new Error(error.message);
  }

  return true;
};

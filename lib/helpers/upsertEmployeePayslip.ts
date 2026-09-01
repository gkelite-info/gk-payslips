import { SupabaseClient } from "@supabase/supabase-js";

export const upsertEmployeePayslip = async (
  supabase: SupabaseClient,
  data: {
    employeePayslipId: string;
    employeeId: string;
    month: string;
    year: number;
    basicSalary: number;
    houseRentAllowance: number;
    transportationAllowance: number;
    telephoneAllowance: number;
    statutoryBonus: number;
    specialAllowance: number;
    companyDeduction: number;
    lossOfPay: number;
    totalSalaryBeforeDeduction: number;
    totalSalaryAfterDeduction: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
) => {
  // Check if a payslip for this exact month/year exists
  const { data: existing, error: fetchError } = await supabase
    .from('employee_payslips')
    .select('employeePayslipId')
    .eq('employeeId', data.employeeId)
    .eq('month', data.month)
    .eq('year', data.year)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  if (existing) {
    const updateData = { ...data };
    // @ts-ignore
    delete updateData.employeePayslipId;
    // @ts-ignore
    delete updateData.createdAt;

    const { error } = await supabase
      .from('employee_payslips')
      .update({
        ...updateData,
        is_deleted: false,
        deletedAt: null
      })
      .eq('employeePayslipId', existing.employeePayslipId);
    
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('employee_payslips')
      .insert(data);
    
    if (error) throw new Error(error.message);
  }

  return true;
};

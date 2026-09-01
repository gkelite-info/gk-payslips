import { SupabaseClient } from "@supabase/supabase-js";

export const deleteEmployeePayslip = async (
  supabase: SupabaseClient,
  employeePayslipId: string
) => {
  const { error } = await supabase
    .from('employee_payslips')
    .delete()
    .eq('employeePayslipId', employeePayslipId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

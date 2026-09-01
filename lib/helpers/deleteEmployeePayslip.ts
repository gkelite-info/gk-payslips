import { SupabaseClient } from "@supabase/supabase-js";

export const deleteEmployeePayslip = async (
  supabase: SupabaseClient,
  employeePayslipId: string
) => {
  const { error } = await supabase
    .from('employee_payslips')
    .update({ 
      is_deleted: true, 
      deletedAt: new Date().toISOString() 
    })
    .eq('employeePayslipId', employeePayslipId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

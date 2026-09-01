import { SupabaseClient } from "@supabase/supabase-js";
import { EmployeePayslipUI } from "./getEmployeePayslips";

export async function getPayslipById(
  supabase: SupabaseClient,
  employeePayslipId: string
): Promise<EmployeePayslipUI | null> {
  const { data, error } = await supabase
    .from('employee_payslips')
    .select('*')
    .eq('employeePayslipId', employeePayslipId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    id: data.employeePayslipId,
    employeeId: data.employeeId,
    month: data.month,
    year: data.year,
    basicSalary: data.basicSalary,
    houseRentAllowance: data.houseRentAllowance,
    transportationAllowance: data.transportationAllowance,
    telephoneAllowance: data.telephoneAllowance,
    statutoryBonus: data.statutoryBonus,
    specialAllowance: data.specialAllowance,
    companyDeduction: data.companyDeduction,
    lossOfPay: data.lossOfPay || 0,
    totalSalaryBeforeDeduction: data.totalSalaryBeforeDeduction,
    totalSalaryAfterDeduction: data.totalSalaryAfterDeduction,
    status: data.status,
    createdAt: data.createdAt,
  };
}

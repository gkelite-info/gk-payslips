import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeePayslipUI {
  id: string;
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
}

export async function getEmployeePayslips(
  supabase: SupabaseClient,
  employeeId: string,
  page: number = 0,
  limit: number = 12
): Promise<{ data: EmployeePayslipUI[], nextCursor: number | undefined }> {
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('employee_payslips')
    .select('*')
    .eq('employeeId', employeeId)
    .is('deletedAt', null)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return { data: [], nextCursor: undefined };

  const parsedData = data.map((slip: any) => ({
    id: slip.employeePayslipId,
    employeeId: slip.employeeId,
    month: slip.month,
    year: slip.year,
    basicSalary: slip.basicSalary,
    houseRentAllowance: slip.houseRentAllowance,
    transportationAllowance: slip.transportationAllowance,
    telephoneAllowance: slip.telephoneAllowance,
    statutoryBonus: slip.statutoryBonus,
    specialAllowance: slip.specialAllowance,
    companyDeduction: slip.companyDeduction,
    lossOfPay: slip.lossOfPay || 0,
    totalSalaryBeforeDeduction: slip.totalSalaryBeforeDeduction,
    totalSalaryAfterDeduction: slip.totalSalaryAfterDeduction,
    status: slip.status,
    createdAt: slip.createdAt,
  }));

  return {
    data: parsedData,
    nextCursor: data.length === limit ? page + 1 : undefined
  };
}

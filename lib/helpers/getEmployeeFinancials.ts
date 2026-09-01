import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeeFinancialUI {
  id: string;
  employeeId: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  panNumber: string;
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
    if (error.code === 'PGRST116') return null; // Not found
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

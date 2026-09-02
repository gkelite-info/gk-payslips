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


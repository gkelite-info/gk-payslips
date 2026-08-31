import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeeSalaryPaymentUI {
  id: string;
  employeePayslipId: string;
  employeeId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  transactionReference: string;
  remarks: string;
  createdAt: string;
  payslip?: {
    month: string;
    year: number;
  };
}

export async function getEmployeeSalaryPayments(
  supabase: SupabaseClient,
  employeeId?: string,
  page: number = 0,
  limit: number = 12
): Promise<{ data: EmployeeSalaryPaymentUI[], nextCursor: number | undefined }> {
  const from = page * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('employee_salary_payments')
    .select(`
      *,
      employee_payslips(month, year)
    `)
    .order('paymentDate', { ascending: false })
    .range(from, to);

  if (employeeId) {
    query = query.eq('employeeId', employeeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return { data: [], nextCursor: undefined };

  const parsedData = data.map((payment: any) => ({
    id: payment.employeeSalaryPaymentId,
    employeePayslipId: payment.employeePayslipId,
    employeeId: payment.employeeId,
    amountPaid: payment.amountPaid,
    paymentDate: payment.paymentDate,
    paymentMethod: payment.paymentMethod,
    transactionReference: payment.transactionReference || "",
    remarks: payment.remarks || "",
    createdAt: payment.createdAt,
    payslip: payment.employee_payslips ? {
      month: payment.employee_payslips.month,
      year: payment.employee_payslips.year,
    } : undefined,
  }));

  return {
    data: parsedData,
    nextCursor: data.length === limit ? page + 1 : undefined
  };
}

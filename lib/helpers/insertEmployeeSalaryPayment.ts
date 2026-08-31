import { SupabaseClient } from "@supabase/supabase-js";

export const insertEmployeeSalaryPayment = async (
  supabase: SupabaseClient,
  data: {
    employeeSalaryPaymentId: string;
    employeePayslipId: string;
    employeeId: string;
    amountPaid: number;
    paymentDate: string;
    paymentMethod: string;
    transactionReference: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
  }
) => {
  const { error } = await supabase
    .from('employee_salary_payments')
    .insert(data);
  
  if (error) throw new Error(error.message);

  return true;
};

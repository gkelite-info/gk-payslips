"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CreditCard, Loader2, ArrowRightLeft } from "lucide-react";
import { useGetEmployeeSalaryPayments } from "@/lib/hooks/employees/useGetEmployeeSalaryPayments";
import { EmployeeSalaryPaymentUI } from "@/lib/helpers/employeeSalaryPayments";
import AddSalaryPaymentModal from "./AddSalaryPaymentModal";

export default function EmployeeSalaryPaymentsClient({ 
  employeeId, 
  initialData 
}: { 
  employeeId: string;
  initialData: { data: EmployeeSalaryPaymentUI[], nextCursor: number | undefined };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    data, 
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useGetEmployeeSalaryPayments(employeeId, initialData);

  const payments = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Salary Payments</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Track actual salary transactions against payslips.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Record Payment
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
              <th className="px-6 py-4 text-left font-semibold">Payment Date</th>
              <th className="px-6 py-4 text-left font-semibold">For Payslip</th>
              <th className="px-6 py-4 text-left font-semibold">Amount Paid</th>
              <th className="px-6 py-4 text-left font-semibold">Method / Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <Loader2 className="animate-spin text-indigo-500 mx-auto" size={24} />
                  <p className="text-slate-500 text-sm mt-3">Loading payments...</p>
                </td>
              </tr>
            ) : payments?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <CreditCard size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">No payments recorded</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click the button above to record the first salary payment.</p>
                </td>
              </tr>
            ) : (
              payments?.map((payment, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={payment.id} 
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-left">
                    <p className="text-sm font-bold text-slate-900">
                      {new Date(payment.paymentDate).toLocaleDateString('en-GB')}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-left">
                    {payment.payslip ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {payment.payslip.month} {payment.payslip.year}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">Unknown Payslip</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-left">
                    <p className="text-sm font-black text-emerald-600">
                      ₹{payment.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-middle text-left">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 capitalize">
                        {payment.paymentMethod.replace('_', ' ')}
                      </span>
                      {payment.transactionReference && (
                        <span className="text-xs text-slate-500 font-mono mt-0.5">Ref: {payment.transactionReference}</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex flex-col items-center justify-center text-sm font-medium text-slate-500">
        <p className="mb-4">Showing {payments.length} payments</p>
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isFetchingNextPage ? <><Loader2 size={16} className="animate-spin" /> Loading more...</> : 'Load More'}
          </button>
        )}
        {!hasNextPage && payments.length > 0 && (
          <p className="text-slate-400">You've reached the end of the list</p>
        )}
      </div>

      <AddSalaryPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        employeeId={employeeId} 
      />
    </div>
  );
}

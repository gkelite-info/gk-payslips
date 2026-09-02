"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CreditCard, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { insertEmployeeSalaryPayment } from "@/lib/helpers/employeeSalaryPayments";
import { useGetEmployeePayslips } from "@/lib/hooks/employees/useGetEmployeePayslips";

export default function AddSalaryPaymentModal({ 
  isOpen, 
  onClose, 
  employeeId 
}: { 
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
}) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: payslipsData, isLoading: isLoadingPayslips } = useGetEmployeePayslips(employeeId);
  const payslips = payslipsData?.pages.flatMap(page => page.data) || [];

  const defaultFormData = {
    employeePayslipId: "",
    amountPaid: 0,
    paymentDate: new Date().toISOString().substring(0, 10),
    paymentMethod: "bank_transfer",
    transactionReference: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handlePayslipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const payslipId = e.target.value;
    const selectedPayslip = payslips.find(p => p.id === payslipId);
    setFormData(prev => ({
      ...prev,
      employeePayslipId: payslipId,
      amountPaid: selectedPayslip ? selectedPayslip.totalSalaryAfterDeduction : prev.amountPaid
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeePayslipId) {
      toast.error("Please select a payslip to associate this payment with.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const now = new Date().toISOString();
      await insertEmployeeSalaryPayment(supabase, {
        employeeSalaryPaymentId: uuidv4(),
        employeeId,
        employeePayslipId: formData.employeePayslipId,
        amountPaid: formData.amountPaid,
        paymentDate: new Date(formData.paymentDate).toISOString(),
        paymentMethod: formData.paymentMethod,
        transactionReference: formData.transactionReference,
        remarks: formData.remarks,
        createdAt: now,
        updatedAt: now,
      });

      toast.success("Payment recorded successfully!");
      queryClient.invalidateQueries({ queryKey: ["employeeSalaryPayments", employeeId] });
      setFormData(defaultFormData);
      onClose();
    } catch (error: any) {
      toast.error("Failed to record payment: " + error.message);
    }
    
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[1.5rem] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Link a transaction to a specific payslip.</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {!isLoadingPayslips && payslips.length === 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">No Payslips Found</p>
                    <p className="text-xs text-amber-700 mt-1">This employee has no generated payslips. You must generate a payslip in the Payslips tab before you can record a payment for them.</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payslip Period <span className="text-red-500">*</span></label>
                <select name="employeePayslipId" value={formData.employeePayslipId} onChange={handlePayslipChange} required disabled={payslips.length === 0} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700">
                  <option value="" disabled>Select a payslip...</option>
                  {payslips.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.month} {p.year} (Net: ₹{p.totalSalaryAfterDeduction.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount Paid (₹) <span className="text-red-500">*</span></label>
                  <input type="number" step="0.01" name="amountPaid" value={formData.amountPaid || ""} placeholder="0" onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Date <span className="text-red-500">*</span></label>
                  <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Method <span className="text-red-500">*</span></label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transaction Ref</label>
                  <input type="text" name="transactionReference" value={formData.transactionReference} onChange={handleChange} placeholder="e.g. UTR123456" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-900 uppercase" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Remarks</label>
                <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Optional notes about this payment..." rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-900 resize-none"></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || payslips.length === 0} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Record Payment'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

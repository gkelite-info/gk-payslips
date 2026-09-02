"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { upsertEmployeePayslip } from "@/lib/helpers/employeePayslips";
import { useGetEmployeeFinancials } from "@/lib/hooks/employees/useGetEmployeeFinancials";
import { EmployeePayslipUI } from "@/lib/helpers/employeePayslips";

export default function GeneratePayslipModal({
  isOpen,
  onClose,
  employeeId,
  editData
}: {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  editData?: EmployeePayslipUI | null;
}) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: financials, isLoading: isLoadingFinancials } = useGetEmployeeFinancials(employeeId);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const defaultFormData = {
    month: months[currentMonthIndex === 0 ? 11 : currentMonthIndex - 1], // Default to previous month
    year: currentMonthIndex === 0 ? currentYear - 1 : currentYear,
    basicSalary: 0,
    houseRentAllowance: 0,
    transportationAllowance: 0,
    telephoneAllowance: 0,
    statutoryBonus: 0,
    specialAllowance: 0,
    companyDeduction: 0,
    lossOfPay: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Auto-populate when financials are loaded and modal opens
  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        month: editData.month,
        year: editData.year,
        basicSalary: editData.basicSalary,
        houseRentAllowance: editData.houseRentAllowance,
        transportationAllowance: editData.transportationAllowance,
        telephoneAllowance: editData.telephoneAllowance,
        statutoryBonus: editData.statutoryBonus,
        specialAllowance: editData.specialAllowance,
        companyDeduction: editData.companyDeduction,
        lossOfPay: editData.lossOfPay || 0,
      });
    } else if (financials && isOpen) {
      setFormData(prev => ({
        ...prev,
        basicSalary: financials.basicSalary,
        houseRentAllowance: financials.houseRentAllowance,
        transportationAllowance: financials.transportationAllowance,
        telephoneAllowance: financials.telephoneAllowance,
        statutoryBonus: financials.statutoryBonus,
        specialAllowance: financials.specialAllowance,
        companyDeduction: financials.companyDeduction,
      }));
    } else if (!financials && isOpen) {
      // Reset to 0 if no financials found
      setFormData(defaultFormData);
    }
  }, [financials, isOpen, editData]);

  const totalSalaryBeforeDeduction =
    (formData.basicSalary || 0) +
    (formData.houseRentAllowance || 0) +
    (formData.transportationAllowance || 0) +
    (formData.telephoneAllowance || 0) +
    (formData.statutoryBonus || 0) +
    (formData.specialAllowance || 0);

  const totalSalaryAfterDeduction = totalSalaryBeforeDeduction - (formData.companyDeduction || 0) - (formData.lossOfPay || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      await upsertEmployeePayslip(supabase, {
        employeePayslipId: editData?.id || uuidv4(), // Helper will handle upsert matching by month/year
        employeeId,
        ...formData,
        totalSalaryBeforeDeduction,
        totalSalaryAfterDeduction,
        status: editData ? editData.status : "draft",
        createdAt: editData ? editData.createdAt : now,
        updatedAt: now,
      });

      toast.success(`Payslip for ${formData.month} ${formData.year} generated successfully!`);
      queryClient.invalidateQueries({ queryKey: ["employeePayslips", employeeId] });
      onClose();
    } catch (error: any) {
      toast.error("Failed to generate payslip: " + error.message);
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[1.5rem] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{editData ? "Edit Payslip" : "Generate Payslip"}</h2>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">{editData ? "Update the payslip allowances and deductions." : "Select month/year and adjust allowances if needed."}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {!financials && !isLoadingFinancials && !editData && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">No Financial Records Found</p>
                    <p className="text-xs text-amber-700 mt-1">We couldn't automatically pull this employee's salary structure because it hasn't been configured yet. Please configure it in the Financials tab first, or manually enter the values below.</p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payslip Month <span className="text-red-500">*</span></label>
                    <select name="month" value={formData.month} onChange={handleChange} disabled={!!editData} required className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 ${editData ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}>
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payslip Year <span className="text-red-500">*</span></label>
                    <select name="year" value={formData.year} onChange={handleChange} disabled={!!editData} required className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 ${editData ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Earnings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Basic Salary</label>
                        <input type="number" step="0.01" name="basicSalary" value={formData.basicSalary || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">House Rent Allowance</label>
                        <input type="number" step="0.01" name="houseRentAllowance" value={formData.houseRentAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Transport</label>
                          <input type="number" step="0.01" name="transportationAllowance" value={formData.transportationAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Telephone</label>
                          <input type="number" step="0.01" name="telephoneAllowance" value={formData.telephoneAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Stat. Bonus</label>
                          <input type="number" step="0.01" name="statutoryBonus" value={formData.statutoryBonus || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Special Allw.</label>
                          <input type="number" step="0.01" name="specialAllowance" value={formData.specialAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Deductions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Company Deduction</label>
                        <input type="number" step="0.01" name="companyDeduction" value={formData.companyDeduction || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Loss Of Pay (LOP)</label>
                        <input type="number" step="0.01" name="lossOfPay" value={formData.lossOfPay || ""} placeholder="0" onChange={handleChange} className="w-full px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-900 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-rose-400 focus:ring-rose-500/20" />
                        <p className="text-[10px] text-slate-400 mt-1">Deducted for unpaid leaves.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Net Salary</p>
                    <p className="text-xs text-emerald-600 font-medium">After all deductions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-600">
                      ₹{totalSalaryAfterDeduction.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || isLoadingFinancials} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2">
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editData ? 'Save Changes' : 'Generate Payslip'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

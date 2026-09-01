"use client";

import { useState, useEffect } from "react";
import { Loader2, DollarSign, Building2, Save } from "lucide-react";
import { useGetEmployeeFinancials } from "@/lib/hooks/employees/useGetEmployeeFinancials";
import { EmployeeFinancialUI } from "@/lib/helpers/getEmployeeFinancials";
import { upsertEmployeeFinancials } from "@/lib/helpers/upsertEmployeeFinancials";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export default function EmployeeFinancialsClient({
  employeeId,
  initialData
}: {
  employeeId: string;
  initialData: EmployeeFinancialUI | null;
}) {
  const queryClient = useQueryClient();
  const { data: financials, isLoading } = useGetEmployeeFinancials(employeeId, initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultFormData = {
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    panNumber: "",
    aadhaarNumber: "",
    uanNumber: "",
    basicSalary: 0,
    houseRentAllowance: 0,
    transportationAllowance: 0,
    telephoneAllowance: 0,
    statutoryBonus: 0,
    specialAllowance: 0,
    companyDeduction: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (financials) {
      setFormData({
        bankName: financials.bankName,
        bankAccountNumber: financials.bankAccountNumber,
        bankIfscCode: financials.bankIfscCode,
        panNumber: financials.panNumber,
        aadhaarNumber: financials.aadhaarNumber || "",
        uanNumber: financials.uanNumber || "",
        basicSalary: financials.basicSalary,
        houseRentAllowance: financials.houseRentAllowance,
        transportationAllowance: financials.transportationAllowance,
        telephoneAllowance: financials.telephoneAllowance,
        statutoryBonus: financials.statutoryBonus,
        specialAllowance: financials.specialAllowance,
        companyDeduction: financials.companyDeduction,
      });
    }
  }, [financials]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number = value;
    
    if (type === 'number') {
      newValue = parseFloat(value) || 0;
    } else if (name === 'bankIfscCode' || name === 'panNumber') {
      newValue = value.toUpperCase();
    } else if (name === 'bankName') {
      newValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      await upsertEmployeeFinancials(supabase, {
        employeeFinancialId: financials?.id || uuidv4(),
        employeeId,
        ...formData,
        createdAt: financials?.createdAt || now,
        updatedAt: now,
      });

      toast.success("Financial records updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employeeFinancials", employeeId] });
    } catch (error: any) {
      toast.error("Failed to update financials: " + error.message);
    }

    setIsSubmitting(false);
  };

  const totalNetSalary = 
    (formData.basicSalary || 0) + 
    (formData.houseRentAllowance || 0) + 
    (formData.transportationAllowance || 0) + 
    (formData.telephoneAllowance || 0) + 
    (formData.statutoryBonus || 0) + 
    (formData.specialAllowance || 0) - 
    (formData.companyDeduction || 0);

  if (isLoading && !financials && !initialData) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manage Financials</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Configure bank details and salary structure.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <Building2 size={20} />
            <h3 className="text-lg font-bold text-slate-900">Bank Details</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank Name <span className="text-red-500">*</span></label>
              <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="HDFC Bank" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Number <span className="text-red-500">*</span></label>
              <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="000123456789" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">IFSC Code <span className="text-red-500">*</span></label>
                <input type="text" name="bankIfscCode" value={formData.bankIfscCode} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 uppercase" placeholder="HDFC0001234" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">PAN Number <span className="text-red-500">*</span></label>
                <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 uppercase" placeholder="ABCDE1234F" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Aadhaar Number</label>
                <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="1234 5678 9012" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">UAN Number</label>
                <input type="text" name="uanNumber" value={formData.uanNumber || ""} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 uppercase" placeholder="100000000000" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-emerald-600">
            <DollarSign size={20} />
            <h3 className="text-lg font-bold text-slate-900">Salary Breakdown</h3>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Basic Salary</label>
                <input type="number" step="0.01" name="basicSalary" value={formData.basicSalary || ""} placeholder="0" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">HRA</label>
                <input type="number" step="0.01" name="houseRentAllowance" value={formData.houseRentAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transportation</label>
                <input type="number" step="0.01" name="transportationAllowance" value={formData.transportationAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telephone</label>
                <input type="number" step="0.01" name="telephoneAllowance" value={formData.telephoneAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Statutory Bonus</label>
                <input type="number" step="0.01" name="statutoryBonus" value={formData.statutoryBonus || ""} placeholder="0" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Special Allowance</label>
                <input type="number" step="0.01" name="specialAllowance" value={formData.specialAllowance || ""} placeholder="0" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Deduction</label>
              <input type="number" step="0.01" name="companyDeduction" value={formData.companyDeduction || ""} placeholder="0" onChange={handleChange} className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition-all text-sm font-medium text-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Net Salary (Monthly)</span>
              <span className="text-2xl font-black text-emerald-600">
                ₹{totalNetSalary.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

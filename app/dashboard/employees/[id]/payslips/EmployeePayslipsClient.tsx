"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Loader2, Download, ExternalLink, Calendar, CheckCircle2, Clock } from "lucide-react";
import { useGetEmployeePayslips } from "@/lib/hooks/employees/useGetEmployeePayslips";
import { EmployeePayslipUI } from "@/lib/helpers/employeePayslips";
import GeneratePayslipModal from "./GeneratePayslipModal";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { deleteEmployeePayslip } from "@/lib/helpers/employeePayslips";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export default function EmployeePayslipsClient({ 
  employeeId, 
  initialData 
}: { 
  employeeId: string;
  initialData: { data: EmployeePayslipUI[], nextCursor: number | undefined };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slipToDelete, setSlipToDelete] = useState<string | null>(null);
  const [editData, setEditData] = useState<EmployeePayslipUI | null>(null);
  const queryClient = useQueryClient();

  const { 
    data, 
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useGetEmployeePayslips(employeeId, initialData);

  const payslips = data?.pages.flatMap(page => page.data) || [];

  const handleEdit = (slip: EmployeePayslipUI) => {
    setEditData(slip);
    setIsModalOpen(true);
  };

  const handleDelete = (slipId: string) => {
    setSlipToDelete(slipId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!slipToDelete) return;
    
    try {
      await deleteEmployeePayslip(supabase, slipToDelete);
      toast.success("Payslip deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employeePayslips", employeeId] });
    } catch (error: any) {
      toast.error("Failed to delete payslip: " + error.message);
    } finally {
      setIsDeleteModalOpen(false);
      setSlipToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Payslips History</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Generate and manage monthly salary slips.</p>
        </div>
        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Generate Payslip
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
              <th className="px-6 py-4 text-left font-semibold">Period</th>
              <th className="px-6 py-4 text-left font-semibold">Net Salary</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Generated On</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 className="animate-spin text-indigo-500 mx-auto" size={24} />
                  <p className="text-slate-500 text-sm mt-3">Loading payslips...</p>
                </td>
              </tr>
            ) : payslips?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <FileText size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">No payslips generated</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click the button above to generate the first payslip for this employee.</p>
                </td>
              </tr>
            ) : (
              payslips?.map((slip, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={slip.id} 
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{slip.month} {slip.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-left">
                    <p className="text-sm font-black text-emerald-600">
                      ₹{slip.totalSalaryAfterDeduction.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-left">
                    {slip.status === 'final' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle2 size={12} /> Final
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                        <Clock size={12} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-left">
                    <p className="text-sm font-medium text-slate-600">
                      {new Date(slip.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/payslip/${slip.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" 
                        title="View Payslip"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button 
                        onClick={() => handleEdit(slip)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                        title="Edit Payslip"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(slip.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                        title="Delete Payslip"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex flex-col items-center justify-center text-sm font-medium text-slate-500">
        <p className="mb-4">Showing {payslips.length} payslips</p>
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isFetchingNextPage ? <><Loader2 size={16} className="animate-spin" /> Loading more...</> : 'Load More'}
          </button>
        )}
        {!hasNextPage && payslips.length > 0 && (
          <p className="text-slate-400">You've reached the end of the list</p>
        )}
      </div>

      <GeneratePayslipModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }} 
        employeeId={employeeId}
        editData={editData} 
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSlipToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Payslip"
        description="Are you sure you want to delete this payslip? It will be removed from the list."
        confirmText="Delete"
      />
    </div>
  );
}

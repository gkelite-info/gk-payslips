"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Loader2, Pencil, Trash2 } from "lucide-react";
import { useGetEmployees } from "@/lib/hooks/employees/useGetEmployees";
import { EmployeeUI } from "@/lib/helpers/getEmployees";
import { deleteEmployee } from "@/lib/helpers/deleteEmployee";
import AddEmployeeModal from "./AddEmployeeModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function EmployeesClient({ initialData, search = "" }: { initialData: { data: EmployeeUI[], nextCursor: number | undefined }, search?: string }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeUI | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeUI | null>(null);

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchTerm, search, pathname, router, searchParams]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useGetEmployees(initialData, search);

  const employees = data?.pages.flatMap(page => page.data) || [];
  const totalLoaded = employees.length;

  const handleEditClick = (emp: EmployeeUI) => {
    setSelectedEmployee(emp);
    setIsAddModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee(supabase, employeeToDelete.userId, employeeToDelete.id);
      toast.success("Employee successfully removed.");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEmployeeToDelete(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setTimeout(() => setSelectedEmployee(null), 300);
        }}
        editData={selectedEmployee}
      />

      <DeleteConfirmationModal
        isOpen={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleDeleteEmployee}
        title="Remove Employee?"
        description={
          <>
            Are you sure you want to remove <strong>{employeeToDelete?.name}</strong>? This will archive their employee profile and deactivate their user account.
          </>
        }
        confirmText="Yes, Remove"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage your workforce, roles, and statuses.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl text-sm font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="flex items-center gap-2 w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full sm:w-64 text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>
          <button className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Employment Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">
                    No employees found.
                  </td>
                </tr>
              ) : employees.map((emp, idx) => (
                <tr key={`${emp.id}-${idx}`} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-100">
                        {emp.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-medium">
                      {emp.employeeSerialNo || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-medium">
                      {emp.empType ? emp.empType.charAt(0).toUpperCase() + emp.empType.slice(1) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        emp.status === 'Alumni' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Employee"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setEmployeeToDelete(emp)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex flex-col items-center justify-center text-sm font-medium text-slate-500 bg-slate-50">
          <p className="mb-4">Showing {totalLoaded} entries</p>
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isFetchingNextPage ? <><Loader2 size={16} className="animate-spin" /> Loading more...</> : 'Load More'}
            </button>
          )}
          {!hasNextPage && employees.length > 0 && (
            <p className="text-slate-400">You&apos;ve reached the end of the list</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Search, Filter } from "lucide-react";

export default function EmployeesPage() {
  const dummyEmployees = [
    { id: "EMP-001", name: "Ananya Sharma", role: "Frontend Developer", department: "Engineering", status: "Active" },
    { id: "EMP-002", name: "Rahul Verma", role: "Product Manager", department: "Product", status: "Active" },
    { id: "EMP-003", name: "Priya Patel", role: "HR Specialist", department: "Human Resources", status: "On Leave" },
    { id: "EMP-004", name: "Vikram Singh", role: "Backend Engineer", department: "Engineering", status: "Active" },
    { id: "EMP-005", name: "Neha Gupta", role: "UI/UX Designer", department: "Design", status: "Active" },
    { id: "EMP-006", name: "Rohan Desai", role: "Sales Lead", department: "Sales", status: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage your workforce, roles, and statuses.</p>
        </div>
        <button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl text-sm font-bold text-white shadow-sm flex items-center gap-2">
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
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="flex items-center gap-2 w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="bg-transparent border-none outline-none text-sm w-full sm:w-64 text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>
          <button className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2 w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummyEmployees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-100">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-medium">{emp.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-medium">{emp.department}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-slate-500 bg-white">
          <p>Showing 1 to 6 of 6 entries</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

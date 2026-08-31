"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGetEmployees } from "@/lib/hooks/employees/useGetEmployees";
import { useGetEmployeeSalaryPayments } from "@/lib/hooks/employees/useGetEmployeeSalaryPayments";

export default function DashboardOverview() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({length: 5}, (_, i) => currentYear - i);

  const { data } = useGetEmployees(undefined, "");
  const { data: salaryData } = useGetEmployeeSalaryPayments(undefined);
  
  const employees = data?.pages.flatMap(page => page.data) || [];
  const activeEmployeesCount = employees.filter(emp => emp.status === "Active").length;
  
  const salaryPayments = salaryData?.pages.flatMap(page => page.data) || [];
  const totalPayroll = salaryPayments.reduce((acc, curr) => acc + curr.amountPaid, 0);

  const stats = [
    { label: "Total Payroll", val: `₹${totalPayroll.toLocaleString('en-IN')}`, trend: "Updated recently" },
    { label: "Active Employees", val: activeEmployeesCount.toString(), trend: "0 this week" },
    { label: "Taxes Paid", val: "₹0", trend: "Fully Compliant" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider">Overview</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        </div>
        <div className="hidden sm:flex gap-3">
          <button className="h-10 px-4 bg-white hover:bg-slate-50 border border-slate-200 transition-colors rounded-xl text-sm font-semibold text-slate-700 shadow-sm flex items-center gap-2">
            Export Report
          </button>
          <button className="h-10 px-4 bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl text-sm font-semibold text-white shadow-sm flex items-center gap-2">
            Run Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] bg-white"
          >
            <p className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{stat.val}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs text-emerald-600 font-semibold">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="h-[400px] w-full rounded-[1.5rem] border border-slate-100 bg-white p-6 flex flex-col relative shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
      >
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Monthly Disbursement</h2>
            <p className="text-sm text-slate-500 font-medium">{selectedYear} trend</p>
          </div>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end justify-between w-full flex-1 gap-2 mt-auto">
          {[
            {h: 42, m: 'Jan'}, {h: 65, m: 'Feb'}, {h: 30, m: 'Mar'}, {h: 85, m: 'Apr'},
            {h: 45, m: 'May'}, {h: 90, m: 'Jun'}, {h: 55, m: 'Jul'}, {h: 75, m: 'Aug'},
            {h: 40, m: 'Sep'}, {h: 60, m: 'Oct'}, {h: 50, m: 'Nov'}, {h: 70, m: 'Dec'}
          ].map((data, i) => (
            <div key={i} className="flex flex-col items-center w-full h-full justify-end gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${data.h}%` }}
                transition={{ duration: 0.8, delay: 0.4 + (i * 0.05) }}
                className="w-full bg-indigo-100 rounded-t-md hover:bg-indigo-500 transition-colors relative group cursor-pointer"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
                  ₹{data.h}L
                </div>
              </motion.div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{data.m}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

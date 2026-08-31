"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, DollarSign, FileText, CreditCard } from "lucide-react";

export default function EmployeeTabs({ employeeId }: { employeeId: string }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", href: `/dashboard/employees/${employeeId}`, icon: User },
    { name: "Addresses", href: `/dashboard/employees/${employeeId}/addresses`, icon: MapPin },
    { name: "Financials", href: `/dashboard/employees/${employeeId}/financials`, icon: DollarSign },
    { name: "Payslips", href: `/dashboard/employees/${employeeId}/payslips`, icon: FileText },
    { name: "Salary Payments", href: `/dashboard/employees/${employeeId}/salary-payments`, icon: CreditCard },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto custom-scrollbar pt-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (pathname.startsWith(tab.href) && tab.href !== `/dashboard/employees/${employeeId}`);

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex items-center gap-2 pb-4 text-sm font-bold whitespace-nowrap transition-colors ${isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"
              }`}
          >
            <tab.icon size={16} />
            {tab.name}
            {isActive && (
              <motion.div
                layoutId="employee-active-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

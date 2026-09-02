import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getEmployeeById } from "@/lib/helpers/employees";
import EmployeeTabs from "./EmployeeTabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EmployeeProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const employeeId = resolvedParams.id;
  const supabase = await createClient();

  const employee = await getEmployeeById(supabase, employeeId);

  if (!employee) {
    redirect("/dashboard/employees");
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50">
      <div className="px-8 pt-8 pb-4 bg-white border-b border-slate-100 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/employees"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-lg border border-indigo-100">
              {employee.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                {employee.name}
              </h1>
              <p className="text-sm font-medium text-slate-500">
                <span className="capitalize">{employee.role}</span> • {employee.employeeSerialNo}
              </p>
            </div>
          </div>
        </div>
        <EmployeeTabs employeeId={employeeId} />
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
}

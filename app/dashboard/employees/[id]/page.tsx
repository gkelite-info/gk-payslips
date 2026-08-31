import { createClient } from "@/utils/supabase/server";
import { getEmployeeById } from "@/lib/helpers/getEmployeeById";
import { redirect } from "next/navigation";

export default async function EmployeeOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const employee = await getEmployeeById(supabase, resolvedParams.id);

  if (!employee) {
    redirect("/dashboard/employees");
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h2>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
            <p className="text-slate-900 font-semibold">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
            <p className="text-slate-900 font-semibold">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Mobile</p>
            <p className="text-slate-900 font-semibold">{employee.mobile}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Alternate Mobile</p>
            <p className="text-slate-900 font-semibold">{employee.alternateMobile || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Employment Details</h2>
        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Employee ID</p>
            <p className="text-slate-900 font-semibold">{employee.employeeSerialNo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Role</p>
            <p className="text-slate-900 font-semibold capitalize">{employee.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Employment Type</p>
            <p className="text-slate-900 font-semibold capitalize">{employee.empType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
            <p className="text-slate-900 font-semibold">{employee.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Joined Date</p>
            <p className="text-slate-900 font-semibold">
              {new Date(employee.joinedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Shift</p>
            <p className="text-slate-900 font-semibold capitalize">{employee.shift}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

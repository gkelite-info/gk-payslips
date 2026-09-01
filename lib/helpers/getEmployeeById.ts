import { SupabaseClient } from "@supabase/supabase-js";
import { EmployeeUI, SupabaseEmployee } from "./getEmployees";

export async function getEmployeeById(supabase: SupabaseClient, employeeId: string): Promise<EmployeeUI | null> {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      employeeId,
      employeeSerialNo,
      userId,
      status,
      employmentType,
      shift,
      joinedAt,
      probationEndDate,
      emergencyContactName,
      emergencyContactPhone,
      designation,
      createdAt,
      users!inner (
        userId,
        firstName,
        lastName,
        email,
        mobile,
        alternateMobile,
        role
      )
    `)
    .eq('employeeId', employeeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  if (!data) return null;

  const typedEmp = data as unknown as SupabaseEmployee;
  const user = Array.isArray(typedEmp.users) ? typedEmp.users[0] : typedEmp.users;

  return {
    id: typedEmp.employeeId,
    employeeSerialNo: typedEmp.employeeSerialNo,
    userId: typedEmp.userId,
    name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    alternateMobile: user?.alternateMobile,
    role: user?.role || "Employee",
    empType: typedEmp.employmentType,
    shift: typedEmp.shift || "general",
    joinedAt: typedEmp.joinedAt,
    status: typedEmp.status === "active" ? "Active" :
      typedEmp.status === "on-leave" ? "On Leave" :
        typedEmp.status === "alumni" ? "Alumni" :
          typedEmp.status === "terminated" ? "Inactive" : "Probation",
    probationEndDate: typedEmp.probationEndDate,
    emergencyContactName: typedEmp.emergencyContactName,
    emergencyContactPhone: typedEmp.emergencyContactPhone,
    designation: typedEmp.designation,
    createdAt: typedEmp.createdAt,
  };
}

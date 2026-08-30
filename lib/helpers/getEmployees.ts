import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeeUI {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  probationEndDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  userId: string;
  joinedAt: string;
  shift: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  alternateMobile?: string;
}

export type SupabaseEmployee = {
  employeeId: string;
  userId: string;
  status: string;
  employmentType: string;
  shift: string;
  joinedAt: string;
  probationEndDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  users: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    alternateMobile?: string;
    role: string;
  } | {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    alternateMobile?: string;
    role: string;
  }[] | null;
};

export async function getEmployees(supabase: SupabaseClient, pageParam: number = 0): Promise<{ data: EmployeeUI[], nextCursor: number | undefined }> {
  const limit = 10;
  const from = pageParam * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('employees')
    .select(`
      employeeId,
      userId,
      status,
      employmentType,
      shift,
      joinedAt,
      probationEndDate,
      emergencyContactName,
      emergencyContactPhone,
      users (
        userId,
        firstName,
        lastName,
        email,
        mobile,
        alternateMobile,
        role
      )
    `)
    .range(from, to)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return { data: [], nextCursor: undefined };
  }

  const mapped = data.map((emp: unknown) => {
    const typedEmp = emp as SupabaseEmployee;
    const user = Array.isArray(typedEmp.users) ? typedEmp.users[0] : typedEmp.users;
    return {
      id: typedEmp.employeeId,
      userId: typedEmp.userId,
      name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      alternateMobile: user?.alternateMobile,
      role: user?.role || "Employee",
      department: typedEmp.employmentType,
      shift: typedEmp.shift || "general",
      joinedAt: typedEmp.joinedAt,
      status: typedEmp.status === "active" ? "Active" : 
              typedEmp.status === "on-leave" ? "On Leave" : 
              typedEmp.status === "alumni" ? "Alumni" :
              typedEmp.status === "terminated" ? "Inactive" : "Probation",
      probationEndDate: typedEmp.probationEndDate,
      emergencyContactName: typedEmp.emergencyContactName,
      emergencyContactPhone: typedEmp.emergencyContactPhone,
    };
  });

  return {
    data: mapped,
    nextCursor: data.length === limit ? pageParam + 1 : undefined
  };
}

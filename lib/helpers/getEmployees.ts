import { SupabaseClient } from "@supabase/supabase-js";

export interface EmployeeUI {
  id: string;
  employeeSerialNo: string;
  name: string;
  role: string;
  empType: string;
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
  employeeSerialNo: string;
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

export async function getEmployees(supabase: SupabaseClient, pageParam: number = 0, searchQuery: string = ""): Promise<{ data: EmployeeUI[], nextCursor: number | undefined }> {
  const limit = 10;
  const from = pageParam * limit;
  const to = from + limit - 1;

  let query = supabase
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
    .range(from, to)
    .order('createdAt', { ascending: false });

  if (searchQuery) {
    const { data: matchedUsers } = await supabase
      .from('users')
      .select('userId')
      .or(`firstName.ilike.%${searchQuery}%,lastName.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      .limit(1000);

    const userIds = matchedUsers?.map(u => u.userId) || [];

    let orString = `employeeSerialNo.ilike.%${searchQuery}%`;

    const searchLower = searchQuery.toLowerCase();
    const validEmploymentTypes = ['full-time', 'part-time', 'contract', 'intern'];
    if (validEmploymentTypes.includes(searchLower)) {
      orString += `,employmentType.eq.${searchLower}`;
    }

    if (userIds.length > 0) {
      orString += `,userId.in.(${userIds.join(',')})`;
    }

    query = query.or(orString);
  }

  const { data, error } = await query;

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
    };
  });

  return {
    data: mapped,
    nextCursor: data.length === limit ? pageParam + 1 : undefined
  };
}

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
  designation?: string;
  userId: string;
  joinedAt: string;
  shift: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  alternateMobile?: string;
  createdAt: string;
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
  designation?: string;
  createdAt: string;
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
      designation: typedEmp.designation,
      createdAt: typedEmp.createdAt,
    };
  });

  return {
    data: mapped,
    nextCursor: data.length === limit ? pageParam + 1 : undefined
  };
}

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


export const insertEmployee = async (
  supabase: SupabaseClient,
  data: {
    employeeId: string;
    employeeSerialNo: string;
    userId: string;
    joinedAt: string;
    shift: string;
    employmentType: string;
    status: string;
    probationEndDate?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    designation?: string | null;
    createdAt: string;
    updatedAt: string;
  }
) => {
  const { error } = await supabase
    .from('employees')
    .insert(data);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};


export const updateEmployee = async (
  supabase: SupabaseClient,
  employeeId: string,
  data: {
    employeeSerialNo: string;
    joinedAt: string;
    shift: string;
    employmentType: string;
    status: string;
    probationEndDate?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    designation?: string | null;
    updatedAt: string;
  }
) => {
  const { error } = await supabase
    .from('employees')
    .update(data)
    .eq('employeeId', employeeId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};


export const deleteEmployee = async (
  supabase: SupabaseClient,
  userId: string,
  employeeId: string
) => {
  const { error: userError } = await supabase
    .from('users')
    .update({ isActive: false, updatedAt: new Date().toISOString() })
    .eq('userId', userId);

  if (userError) {
    throw new Error("Failed to remove user account: " + userError.message);
  }

  const { error: empError } = await supabase
    .from('employees')
    .update({ status: 'alumni', updatedAt: new Date().toISOString() })
    .eq('employeeId', employeeId);

  if (empError) {
    throw new Error("Failed to update employee status: " + empError.message);
  }

  return true;
};


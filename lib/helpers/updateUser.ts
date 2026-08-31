import { SupabaseClient } from "@supabase/supabase-js";

export const updateUser = async (
  supabase: SupabaseClient,
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    alternateMobile?: string;
    role: string;
    updatedAt: string;
  }
) => {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('userId', userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

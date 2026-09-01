import { SupabaseClient } from "@supabase/supabase-js";

export const updateUser = async (
  supabase: SupabaseClient,
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    alternateMobile?: string | null;
    role: string;
    updatedAt: string;
  }
) => {
  const updatePayload = {
    ...data,
    alternateMobile: data.alternateMobile || null
  };

  const { error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('userId', userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

import { supabase } from "@/lib/supabaseClient";

export async function getUser() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error("No active session found");
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("userId", session.user.id)
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  return user;
}

"use server";

import { SupabaseClient } from "@supabase/supabase-js";

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

export const signupUser = async (payload: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  alternateMobile: string | null;
  role: string;
}) => {
  try {
    const { userId, firstName, lastName, email, mobile, alternateMobile, role } = payload;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          userId,
          firstName,
          lastName,
          email,
          mobile,
          alternateMobile: alternateMobile || null,
          role,
          isActive: true,
          is_deleted: false,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "User registered successfully",
      data,
    };
  } catch (err: any) {
    console.error("SIGNUP ERROR:", err.message);
    let message = "Something went wrong";

    if (err.code === "23505") {
      if (err.message?.includes("email") || err.details?.includes("email")) {
        message = "Email is already registered";
      } else if (err.message?.includes("mobile") || err.details?.includes("mobile")) {
        message = "Mobile number is already registered";
      } else if (err.message?.includes("alternateMobile") || err.details?.includes("alternateMobile")) {
        message = "Alternate mobile number is already registered";
      } else {
        message = "Duplicate record already exists";
      }
    }
    return { success: false, error: message };
  }
};


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


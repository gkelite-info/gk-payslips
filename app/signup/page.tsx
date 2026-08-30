"use client";

import { useState } from "react";
import { signupUser } from "@/lib/helpers/signupUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const alternateMobile = formData.get("alternateMobile") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!passwordRegex.test(password)) {
      setError("Password must include uppercase, lowercase, number and special character.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/login",
        },
      });

      if (authError) throw authError;

      const authUser = data.user;
      if (!authUser) throw new Error("Auth user not created");

      const result = await signupUser({
        userId: authUser.id,
        firstName,
        lastName,
        email,
        mobile,
        alternateMobile,
        role: "fullstack",
      });

      if (result.success) {
        toast.success("Please verify your email!");
        router.push("/login");
      } else {
        throw new Error(result.error || "Failed to save user profile");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-[length:400%_400%] animate-gradient p-4 sm:p-8">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/20 p-8 md:p-10 shadow-2xl backdrop-blur-xl border border-white/30 dark:bg-black/20 dark:border-white/10 transition-all duration-300 hover:shadow-indigo-500/25">
        {/* Decorative Blob */}
        <div className="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-purple-400/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-indigo-400/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="mb-2 text-3xl font-bold text-white tracking-tight">
            Create an Account
          </h1>
          <p className="mb-6 text-center text-sm text-white/80 font-medium">
            Join the Payroll Dashboard
          </p>

          {error && (
            <div className="mb-4 w-full rounded-lg bg-red-500/20 p-3 text-sm text-white border border-red-500/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white/90 ml-1">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                placeholder="John"
                className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white/90 ml-1">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Doe"
                className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-semibold text-white/90 ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white/90 ml-1">
                Mobile
              </label>
              <input
                name="mobile"
                type="tel"
                placeholder="1234567890"
                className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white/90 ml-1">
                Alt Mobile
              </label>
              <input
                name="alternateMobile"
                type="tel"
                placeholder="0987654321"
                className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white/90 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white/90 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 md:col-span-2 w-full rounded-xl bg-white px-4 py-3.5 text-indigo-600 font-bold tracking-wide shadow-lg transition-all hover:bg-indigo-50 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/70 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-white hover:text-indigo-200 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

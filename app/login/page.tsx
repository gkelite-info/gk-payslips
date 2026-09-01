"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const emailCookie = cookies.find(c => c.trim().startsWith('remembered_email='));
    const passwordCookie = cookies.find(c => c.trim().startsWith('remembered_password='));
    
    if (emailCookie) {
      setEmail(decodeURIComponent(emailCookie.split('=')[1]));
      setRememberMe(true);
    }
    
    if (passwordCookie) {
      try {
        setPassword(atob(decodeURIComponent(passwordCookie.split('=')[1])));
      } catch (e) {
        // Ignore decode error
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        if (rememberMe) {
          document.cookie = `remembered_email=${encodeURIComponent(email)}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Strict`;
          document.cookie = `remembered_password=${encodeURIComponent(btoa(password))}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Strict`;
        } else {
          document.cookie = `remembered_email=; max-age=0; path=/; SameSite=Strict`;
          document.cookie = `remembered_password=; max-age=0; path=/; SameSite=Strict`;
        }

        toast.success("Successfully logged in!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-[length:400%_400%] animate-gradient p-4 sm:p-8">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/20 p-8 shadow-2xl backdrop-blur-xl border border-white/30 dark:bg-black/20 dark:border-white/10 transition-all duration-300 hover:shadow-indigo-500/25">
        <div className="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-purple-400/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-indigo-400/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 rounded-full bg-white/30 p-3 shadow-inner backdrop-blur-md">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="mb-6 text-center text-sm text-white/80 font-medium">
            Sign in to access your Payroll Dashboard
          </p>

          {error && (
            <div className="mb-4 w-full rounded-lg bg-red-500/20 p-3 text-sm text-white border border-red-500/50">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white/90 ml-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white/90 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-white/50 border border-white/20 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-indigo-500/50 transition-colors"
                />
                <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="font-semibold text-white hover:text-indigo-200 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-white px-4 py-3.5 text-indigo-600 font-bold tracking-wide shadow-lg transition-all hover:bg-indigo-50 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* <p className="mt-8 text-sm text-white/70 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-white hover:text-indigo-200 transition-colors"
            >
              Sign Up
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}

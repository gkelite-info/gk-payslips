"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  Users,
  HeartPulse,
  FolderKanban,
  Trophy,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut
} from "lucide-react";
import { useGetUser } from "@/lib/hooks/auth/useGetUser";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: user, isLoading } = useGetUser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const userInitials = user ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase() : "AD";
  const userName = user ? `${user.firstName} ${user.lastName}` : "Admin User";
  const userEmail = user ? user.email : "admin@gkelite.com";

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: Wallet },
    { name: "Employees", href: "/dashboard/employees", icon: Users },
    { name: "Leaves", href: "/dashboard/leaves", icon: HeartPulse },
    { name: "Taxes", href: "/dashboard/taxes", icon: FolderKanban },
    { name: "Reports", href: "/dashboard/reports", icon: Trophy },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100/60 justify-between md:justify-start">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs tracking-tight">GK</span>
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">Elite-Info</span>
          </Link>
          <button
            className="md:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <item.icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100/60">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Settings size={18} className="text-slate-400" />
            <span className="font-semibold text-sm">Settings</span>
          </Link>

          <div className="mt-4 flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200 uppercase">
              {isLoading ? "..." : userInitials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{isLoading ? "Loading..." : userName}</p>
              <p className="text-xs text-slate-500 font-medium truncate">{isLoading ? "" : userEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-500 hover:text-slate-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg w-64 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center hover:ring-2 hover:ring-offset-2 hover:ring-slate-900 transition-all uppercase cursor-pointer"
              >
                {isLoading ? "..." : userInitials}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-slate-50">
                      <p className="text-sm font-bold text-slate-900 truncate">{isLoading ? "Loading..." : userName}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{isLoading ? "" : userEmail}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold text-left cursor-pointer"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

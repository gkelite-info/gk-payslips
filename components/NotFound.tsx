"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-4 font-sans text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />
        
        <h1 className="text-8xl md:text-[120px] font-bold tracking-tighter text-slate-900 leading-none">
          4<span className="text-indigo-600">0</span>4
        </h1>
        
        <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Page not found
        </h2>
        
        <p className="mt-4 max-w-md text-base text-slate-500 font-medium leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="mt-10 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1 hover:shadow-slate-900/30 active:translate-y-0 flex items-center gap-2"
        >
          Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
}

"use client";

import { InstagramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  MonitorSmartphone,
  Wallet,
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Trophy,
  FolderKanban,
  Globe,
  Crown,
  UserCog,
  Briefcase,
  DollarSign,
  CreditCard,
  Smile,
  Stethoscope,
  Building,
  Star,
  CheckCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from 'sonner';
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const scrollToContact = () => {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
};

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

const stats = [
  { numericValue: 120, suffix: "+", label: "Enterprises" },
  { numericValue: 450, suffix: "K", label: "Employees" },
  { numericValue: 99, suffix: "%", label: "Accuracy" },
  { numericValue: 100, suffix: "%", label: "Compliance" },
];

const modules = [
  { icon: Wallet, title: "Payroll Processing", desc: "Automated salary calculations, dynamic deductions, and flawless one-click disbursements." },
  { icon: Users, title: "HR Lifecycle", desc: "Elegant onboarding experiences, profile management, and intuitive employee self-service." },
  { icon: Building2, title: "Time & Attendance", desc: "Seamless biometric integrations, timesheets, shift scheduling, and overtime tracking." },
  { icon: HeartPulse, title: "Leave Management", desc: "Customizable leave policies, multi-tier approval workflows, and real-time balances." },
  { icon: FolderKanban, title: "Tax & Compliance", desc: "Effortless PF, PT, ESI, TDS calculations with automated statutory report generation." },
  { icon: BookOpen, title: "Document Vault", desc: "Highly secure digital storage for payslips, Form 16s, offer letters, and policies." },
  { icon: Trophy, title: "Performance", desc: "Refined goal setting, 360-degree appraisals, and continuous feedback loops." },
  { icon: DollarSign, title: "Expense Management", desc: "Streamlined multi-level approvals for corporate reimbursements and travel budgets." },
];

const portals = [
  { icon: Globe, title: "Global Admin", desc: "Full system control, multi-region compliance, and master configurations.", color: "text-slate-700", bg: "bg-slate-100 border-slate-200" },
  { icon: Crown, title: "HR Head", desc: "Organization-wide HR metrics and high-level workforce analytics.", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  { icon: Building, title: "HR Executive", desc: "Daily operations, employee onboarding, and query resolutions.", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
  { icon: Wallet, title: "Finance Manager", desc: "Payroll authorization, budget allocation, and statutory remittances.", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  { icon: CreditCard, title: "Payroll Exec", desc: "Monthly processing, variable pay uploads, and bank file generation.", color: "text-sky-600", bg: "bg-sky-50 border-sky-100" },
  { icon: Users, title: "Manager Portal", desc: "Team attendance tracking, leave approvals, and shift planning.", color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  { icon: UserCog, title: "Employee App", desc: "Self-service access to payslips, tax declarations, and leave requests.", color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
  { icon: ShieldCheck, title: "Auditor View", desc: "Read-only access to payroll logs and compliance reports.", color: "text-teal-600", bg: "bg-teal-50 border-teal-100" },
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Chief Human Resources Officer",
    institution: "Nexus Tech Solutions",
    quote: "GK Elite-Info brings a level of elegance and simplicity to payroll that I've never seen before. What used to take days of manual Excel work now happens flawlessly in minutes.",
    rating: 5,
  },
  {
    name: "Anita Desai",
    role: "VP of Finance",
    institution: "Vertex Manufacturing",
    quote: "The multi-level approval workflows and crystal-clear audit trails have made our monthly payroll entirely frictionless. It's a beautifully crafted system.",
    rating: 5,
  },
  {
    name: "Karan Mehta",
    role: "Director of Operations",
    institution: "Global Logistics Ltd.",
    quote: "Managing shifts and leave balances for 5,000+ employees is effortless now. GK Elite-Info combines breathtaking design with enterprise-grade reliability.",
    rating: 5,
  },
];

const chartData = [
  { name: "Jan", value: 320 },
  { name: "Feb", value: 380 },
  { name: "Mar", value: 350 },
  { name: "Apr", value: 460 },
  { name: "May", value: 520 },
  { name: "Jun", value: 680 },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavClick = (sectionId: string) => {
    router.push(`/`);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={`mx-auto max-w-6xl flex items-center justify-between transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl px-6 py-3" : "bg-transparent px-2"
          }`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg tracking-tight">GK</span>
            </div>
            <span
              className="text-xl font-semibold tracking-tight text-slate-900 cursor-pointer"
              onClick={() => {
                router.push('/');
                window.scrollTo(0, 0)
              }}
            >
              Elite<span className="text-slate-500 font-medium">-Info</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <button onClick={() => handleNavClick("features")} className="hover:text-slate-900 transition-colors">Modules</button>
            <button onClick={() => handleNavClick("portals")} className="hover:text-slate-900 transition-colors">Portals</button>
            <button onClick={() => handleNavClick("testimonials")} className="hover:text-slate-900 transition-colors">Testimonials</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleLogin}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
            >
              Log In
            </button>
            <button
              onClick={scrollToContact}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-xl hover:shadow-slate-900/10 flex items-center gap-2"
            >
              Request Demo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {
        mobileMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-4">
            <button onClick={() => handleNavClick("features")} className="text-lg font-medium text-slate-900 text-left">Modules</button>
            <button onClick={() => handleNavClick("portals")} className="text-lg font-medium text-slate-900 text-left">Portals</button>
            <button onClick={() => handleNavClick("testimonials")} className="text-lg font-medium text-slate-900 text-left">Testimonials</button>
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogin}
                className="w-full text-center py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => { scrollToContact(); setMobileMenuOpen(false); }}
                className="bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold w-full shadow-md"
              >
                Request Demo
              </button>
            </div>
          </div>
        )
      }
    </nav >
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[100dvh] pt-32 pb-20 flex items-center overflow-hidden bg-[#FAFAFA]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/60 bg-white/50 backdrop-blur-sm text-slate-600 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              The New Standard in HR
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[84px] font-bold leading-[1.05] mb-8 tracking-tight text-slate-900">
              Payroll, refined to <br className="hidden md:block" />
              <span className="text-slate-400">perfection.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl font-medium">
              A beautifully crafted platform designed to automate salary processing, tax compliance, and workforce administration with absolute precision and elegance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <button
                onClick={scrollToContact}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] w-full sm:w-auto"
              >
                Schedule Demo
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-full font-semibold text-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm w-full sm:w-auto"
              >
                Explore Features <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Elegant Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-[2rem] bg-white/60 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white backdrop-blur-xl">
            <div className="rounded-[1.75rem] overflow-hidden bg-white border border-slate-100 shadow-sm relative flex">

              {/* Sidebar mockup */}
              <div className="hidden md:flex w-64 bg-slate-50 border-r border-slate-100 flex-col p-6 gap-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs tracking-tight">GK</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm tracking-tight">Elite-Info</span>
                </div>
                <div className="space-y-2">
                  {[
                    { icon: Wallet, label: "Payroll", active: true },
                    { icon: Users, label: "Employees", active: false },
                    { icon: HeartPulse, label: "Leaves", active: false },
                    { icon: FolderKanban, label: "Taxes", active: false },
                    { icon: Trophy, label: "Reports", active: false }
                  ].map((item, i) => (
                    <div key={i} className={`h-10 rounded-xl ${item.active ? 'bg-white shadow-sm border border-slate-100 text-slate-900' : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'} flex items-center px-3 gap-3 transition-colors cursor-default`}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content mockup */}
              <div className="flex-1 p-6 md:p-10 bg-white">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <p className="text-sm text-slate-500 mb-1 font-semibold uppercase tracking-wider">Overview</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Payroll Dashboard</h3>
                  </div>
                  <div className="hidden sm:flex gap-3">
                    <button className="h-11 px-5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2">
                      Export
                    </button>
                    <button className="h-11 px-5 bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl text-sm font-semibold text-white flex items-center gap-2">
                      Run Payroll
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Total Payroll", val: "₹4.2 Cr", trend: "+12% vs last month" },
                    { label: "Active Employees", val: "1,240", trend: "+5 this week" },
                    { label: "Taxes Paid", val: "₹85 L", trend: "Fully Compliant" }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[1.5rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] bg-white">
                      <p className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{stat.val}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <p className="text-xs text-emerald-600 font-semibold">{stat.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-[260px] w-full rounded-[1.5rem] border border-slate-100 bg-[#FAFAFA] p-6 flex flex-col justify-end relative overflow-hidden">
                  <div className="absolute top-6 left-6">
                    <p className="text-sm font-bold text-slate-900 mb-1">Monthly Disbursement</p>
                    <p className="text-xs text-slate-500 font-medium">Last 12 months trend</p>
                  </div>
                  {/* Abstract chart representation */}
                  <div className="flex items-end justify-between w-full h-[160px] gap-2 px-2 mt-auto">
                    {[30, 45, 25, 60, 40, 75, 55, 90, 65, 80, 50, 85].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.05) }}
                        className="w-full bg-slate-200 rounded-t-md hover:bg-slate-300 transition-colors relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{h}L
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function StatCounter({ numericValue, suffix, label }: { numericValue: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(numericValue);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
        <span ref={ref}>{count}</span>{suffix}
      </h2>
      <p className="text-slate-500 font-medium text-sm uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

const Stats = () => {
  return (
    <section className="py-24 bg-white border-y border-slate-100 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x divide-slate-100">
          {stats.map((stat, i) => (
            <div key={i} className="flex justify-center">
              <StatCounter {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Modules = () => {
  return (
    <section id="features" className="py-32 relative bg-[#FAFAFA]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Everything you need. <br className="hidden sm:block" /><span className="text-slate-400">Nothing you don't.</span></h2>
          <p className="text-lg text-slate-500">A unified, beautifully designed suite of tools that brings clarity and speed to your entire HR operations.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-300">
                <mod.icon className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{mod.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{mod.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portals = () => {
  return (
    <section id="portals" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-4 block">Access Control</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Tailored experiences for every role.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Intelligent access control delivers a personalized, secure workspace. Everyone sees exactly what they need to see, exactly when they need it.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {portals.map((portal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-[1.5rem] bg-[#FAFAFA] border border-slate-100 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group cursor-default"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-full ${portal.bg} flex items-center justify-center shrink-0`}>
                  <portal.icon className={`w-4 h-4 ${portal.color}`} />
                </div>
                <h4 className="font-semibold text-slate-900 text-base">{portal.title}</h4>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {portal.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 relative bg-[#FAFAFA] border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Trusted by industry leaders</h2>
          <p className="text-lg text-slate-500">Real results from administrators who upgraded to elegance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-8">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", institution: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.institution || !form.email) {
      setStatus("error");
      setMessage("Please fill in all fields.");
      return;
    }
    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setMessage("Thank you! We'll reach out shortly to schedule your demo.");
      setForm({ firstName: "", lastName: "", institution: "", email: "" });
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="rounded-[2.5rem] p-8 md:p-16 max-w-5xl mx-auto bg-[#FAFAFA] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Ready for an upgrade?</h2>
              <p className="text-lg text-slate-500 mb-12">
                Schedule a personalized demo and experience the future of payroll management.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1 text-lg">Headquarters</h4>
                    <p className="text-slate-500 leading-relaxed">
                      Opp: Pillar No. 1432, 6-3-853/1, 306 B, 3rd Floor Meridian Plaza,<br />
                      Ameerpet, Hyderabad, Telangana - 500016
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1 text-lg">Phone</h4>
                    <p className="text-slate-500">+91 9000266832, +91 7093256562</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1 text-lg">Email</h4>
                    <p className="text-slate-500">business@gkeliteinfo.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Request Demo</h3>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Request Sent!</h4>
                  <p className="text-slate-500">{message}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-slate-600 font-medium text-sm mt-4 hover:text-slate-900 transition-colors"
                  >
                    Submit another request
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">First Name</label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^A-Za-z]/g, "");
                          setForm((f) => ({ ...f, firstName: val.charAt(0).toUpperCase() + val.slice(1) }));
                        }}
                        className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Last Name</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^A-Za-z]/g, "");
                          setForm((f) => ({ ...f, lastName: val.charAt(0).toUpperCase() + val.slice(1) }));
                        }}
                        className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company Name</label>
                    <input
                      type="text"
                      value={form.institution}
                      onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
                      className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Work Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      onBlur={(e) => {
                        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                          toast.error("Invalid Email", { description: "Please enter a valid work email." });
                        }
                      }}
                      className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-sm text-red-500 font-medium">{message}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-md"
                  >
                    {status === "loading" ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : "Submit Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-24 pb-12 rounded-t-[3rem] mt-[-2rem] relative z-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">GK</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Elite<span className="text-slate-400 font-medium">-Info</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
              The enterprise-grade payroll and HR management platform that brings precision and elegance to your workforce.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/9000266832" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors">
                <WhatsappLogoIcon size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors">
                <InstagramLogoIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Modules</a></li>
              <li><a href="#portals" className="text-slate-400 hover:text-white transition-colors">Portals</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="https://www.gkeliteinfo.com/about" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="https://www.gkeliteinfo.com/services" className="text-slate-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="https://www.gkeliteinfo.com/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GK Elite-Info Payroll. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="mailto:business@gkeliteinfo.com" className="hover:text-white transition-colors">business@gkeliteinfo.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Page() {
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-slate-200">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Modules />
        <Portals />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

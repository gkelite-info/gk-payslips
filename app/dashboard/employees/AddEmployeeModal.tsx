"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { signupUser } from "@/lib/helpers/signupUser";
import { updateUser } from "@/lib/helpers/updateUser";
import { updateEmployee } from "@/lib/helpers/updateEmployee";
import { insertEmployee } from "@/lib/helpers/insertEmployee";
import { EmployeeUI } from "@/lib/helpers/getEmployees";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: EmployeeUI | null;
}

export default function AddEmployeeModal({ isOpen, onClose, editData }: AddEmployeeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const isEditing = !!editData;

  const defaultFormData = {
    employeeSerialNo: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    joinedAt: new Date().toISOString().split('T')[0],
    shift: "general",
    employmentType: "full-time",
    status: "active",
    probationEndDate: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    role: "fullstack",
    designation: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          employeeSerialNo: editData.employeeSerialNo || "",
          firstName: editData.firstName || "",
          lastName: editData.lastName || "",
          email: editData.email || "",
          mobile: editData.mobile || "",
          alternateMobile: editData.alternateMobile || "",
          joinedAt: editData.joinedAt ? new Date(editData.joinedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          shift: editData.shift || "general",
          employmentType: editData.empType || "full-time",
          status: editData.status.toLowerCase() === 'on leave' ? 'on-leave' :
            editData.status.toLowerCase() === 'inactive' ? 'terminated' :
              editData.status.toLowerCase() === 'alumni' ? 'alumni' :
                editData.status.toLowerCase() === 'probation' ? 'probation' : 'active',
          probationEndDate: editData.probationEndDate ? new Date(editData.probationEndDate).toISOString().split('T')[0] : "",
          emergencyContactName: editData.emergencyContactName || "",
          emergencyContactPhone: editData.emergencyContactPhone || "",
          role: editData.role?.toLowerCase() || "fullstack",
          designation: editData.designation || "",
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const now = new Date().toISOString();

    if (isEditing) {

      try {
        await updateUser(supabase, editData.userId, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          alternateMobile: formData.alternateMobile,
          role: formData.role,
          updatedAt: now,
        });
      } catch (userError: any) {
        console.error("[AddEmployeeModal] User update error:", userError.message);
        toast.error("Failed to update user details: " + userError.message);
        setIsSubmitting(false);
        return;
      }

      try {
        await updateEmployee(supabase, editData.id, {
          employeeSerialNo: formData.employeeSerialNo,
          joinedAt: formData.joinedAt,
          shift: formData.shift,
          employmentType: formData.employmentType,
          status: formData.status,
          probationEndDate: formData.probationEndDate || null,
          emergencyContactName: formData.emergencyContactName || null,
          emergencyContactPhone: formData.emergencyContactPhone || null,
          designation: formData.designation || null,
          updatedAt: now,
        });
        toast.success("Employee updated successfully");
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        onClose();
      } catch (empError: any) {
        console.error("[AddEmployeeModal] Employee update error:", empError.message);
        toast.error("Failed to update employee details: " + empError.message);
      }

      setIsSubmitting(false);
      return;
    }

    const newUserId = uuidv4();
    const newEmployeeId = uuidv4();

    const userResult = await signupUser({
      userId: newUserId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      alternateMobile: formData.alternateMobile,
      role: formData.role,
    });

    if (!userResult.success) {
      toast.error(userResult.error || "Failed to create user");
      setIsSubmitting(false);
      return;
    }

    try {
      await insertEmployee(supabase, {
        employeeId: newEmployeeId,
        employeeSerialNo: formData.employeeSerialNo,
        userId: newUserId,
        joinedAt: formData.joinedAt,
        shift: formData.shift,
        employmentType: formData.employmentType,
        status: formData.status,
        probationEndDate: formData.probationEndDate || null,
        emergencyContactName: formData.emergencyContactName || null,
        emergencyContactPhone: formData.emergencyContactPhone || null,
        designation: formData.designation || null,
        createdAt: now,
        updatedAt: now,
      });

      toast.success("Employee added successfully");
      setFormData(defaultFormData);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    } catch (error: any) {
      toast.error("Failed to add employee: " + error.message);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[1.5rem] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{isEditing ? "Edit Employee" : "Add New Employee"}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">{isEditing ? "Update existing user and employee details." : "Create a user profile and assign employee details."}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">User Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name <span className="text-red-500">*</span></label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isEditing} className={`w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700 ${isEditing ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`} placeholder="john@example.com" />
                      {isEditing && <p className="text-xs text-slate-400 mt-1">Email cannot be changed after creation.</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role <span className="text-red-500">*</span></label>
                      <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700">
                        <option value="fullstack">Fullstack</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="designer">Designer</option>
                        <option value="automationtester">Automation Tester</option>
                        <option value="manualtester">Manual Tester</option>
                        <option value="devops">DevOps</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile <span className="text-red-500">*</span></label>
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="+1234567890" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alternate Mobile</label>
                      <input type="tel" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="+0987654321" />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Employment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee Id <span className="text-red-500">*</span></label>
                      <input type="text" name="employeeSerialNo" value={formData.employeeSerialNo} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="EMP-001" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
                      <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" placeholder="Software Engineer" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Joined Date <span className="text-red-500">*</span></label>
                      <input type="date" name="joinedAt" value={formData.joinedAt} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                      <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700">
                        <option value="active">Active</option>
                        <option value="probation">Probation</option>
                        <option value="on-leave">On Leave</option>
                        <option value="alumni">Alumni</option>
                        <option value="terminated">Terminated</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employment Type <span className="text-red-500">*</span></label>
                      <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700">
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="intern">Intern</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Shift <span className="text-red-500">*</span></label>
                      <select name="shift" value={formData.shift} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700">
                        <option value="general">General</option>
                        <option value="morning">Morning</option>
                        <option value="night">Night</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Additional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Probation End Date</label>
                      <input type="date" name="probationEndDate" value={formData.probationEndDate} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Emergency Contact Name <span className="text-red-500">*</span></label>
                      <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required placeholder="Jane Doe" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Emergency Contact Phone <span className="text-red-500">*</span></label>
                      <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} required placeholder="+1234567890" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-medium text-slate-700" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer">
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (isEditing ? 'Save Changes' : 'Save Employee')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Home, MapPin, Loader2 } from "lucide-react";
import { useGetEmployeeAddresses } from "@/lib/hooks/employees/useGetEmployeeAddresses";
import { EmployeeAddressUI } from "@/lib/helpers/getEmployeeAddresses";
import AddAddressModal from "./AddAddressModal";

export default function EmployeeAddressesClient({ 
  employeeId, 
  initialData 
}: { 
  employeeId: string;
  initialData: EmployeeAddressUI[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: addresses, isLoading } = useGetEmployeeAddresses(employeeId, initialData);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Manage Addresses</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 py-8 flex justify-center">
            <Loader2 className="animate-spin text-indigo-500" />
          </div>
        ) : addresses?.length === 0 ? (
          <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <MapPin size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No addresses found</h3>
            <p className="text-xs text-slate-500 mt-1">Add an address to get started.</p>
          </div>
        ) : (
          addresses?.map((addr) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Home size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">{addr.addressType}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm font-medium text-slate-700">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                <p className="text-slate-500">{addr.country}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AddAddressModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        employeeId={employeeId} 
      />
    </div>
  );
}

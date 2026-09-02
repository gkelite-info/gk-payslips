import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import PrintButton from "./PrintButton";
import { getPayslipById } from "@/lib/helpers/employeePayslips";
import { getEmployeeById } from "@/lib/helpers/employees";
import { getEmployeeFinancials } from "@/lib/helpers/employeeFinancials";
import { getEmployeeAddresses } from "@/lib/helpers/employeeAddresses";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;
  const supabase = await createClient();
  const payslip = await getPayslipById(supabase, id);

  if (!payslip) {
    return { title: "Payslip" };
  }

  const employee = await getEmployeeById(supabase, payslip.employeeId);
  const employeeName = employee ? employee.name : "Employee";

  return {
    title: `Payslip_${employeeName}_${payslip.month}_${payslip.year}`.replace(/\s+/g, '_')
  };
}

export default async function PayslipPrintPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const supabase = await createClient();

  const payslip = await getPayslipById(supabase, id);

  if (!payslip) {
    return notFound();
  }

  const employee = await getEmployeeById(supabase, payslip.employeeId);
  const financials = await getEmployeeFinancials(supabase, payslip.employeeId);
  const addresses = await getEmployeeAddresses(supabase, payslip.employeeId);

  const address = addresses?.[0];

  const employeeName = employee ? employee.name.toUpperCase() : "UNKNOWN";
  const mobile = employee?.mobile || "-";

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIdx = monthNames.indexOf(payslip.month.substring(0, 3));
  const fromDate = new Date(payslip.year, monthIdx, 1);
  const toDate = new Date(payslip.year, monthIdx + 1, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const basic = payslip.basicSalary || 0;
  const hra = payslip.houseRentAllowance || 0;
  const transport = payslip.transportationAllowance || 0;
  const telephone = payslip.telephoneAllowance || 0;
  const bonus = payslip.statutoryBonus || 0;
  const special = payslip.specialAllowance || 0;

  const totalEarnings = basic + hra + transport + telephone + bonus + special;

  const companyDeduction = payslip.companyDeduction || 0;
  const lossOfPay = payslip.lossOfPay || 0;
  const totalDeductions = companyDeduction + lossOfPay;

  const netAmount = payslip.totalSalaryAfterDeduction || 0;

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }; return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 print:p-0 print:py-8 print:bg-white">
      <style type="text/css" media="print">
        {`@page { margin: 0; }`}
      </style>
      <div className="max-w-[21cm] mx-auto bg-white print:shadow-none shadow-xl p-8 print:px-8 print:py-0 min-h-[29.7cm] print:min-h-0">
        <div className="text-center mb-6 pb-4 border-b-2 border-slate-200">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 relative flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="GK Elite Info Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">GK ELITE INFO LLP</h1>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            6-3-853/1, 306B, Opp Metro Pillar: 1432, Ameerpet, Hyderabad, TS 500016 | Ph: 9000266832
          </p>
          <div className="inline-block bg-slate-100 px-6 py-2 rounded-full">
            <h2 className="text-base font-bold tracking-widest text-slate-800">PAYSLIP</h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {formatDate(fromDate)} - {formatDate(toDate)}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-xs">
          <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200/60">
            <div>
              <h3 className="font-bold text-base text-slate-800">{employeeName}</h3>
              {address ? (
                <p className="text-slate-500 mt-1">
                  {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                  {address.city}, {address.state} {address.zipCode}
                </p>
              ) : (
                <p className="text-slate-500 mt-1">Address not on file</p>
              )}
              <p className="text-slate-500 mt-1">Phone: {mobile}</p>
            </div>
            <div className="text-right space-y-1">
              <p><span className="text-slate-500">Employee ID:</span> <span className="font-bold">{employee?.employeeSerialNo || '-'}</span></p>
              <p><span className="text-slate-500">Date of Joining:</span> <span className="font-bold">{employee?.joinedAt ? new Date(employee.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span></p>
              <p><span className="text-slate-500">Designation:</span> <span className="font-bold">{employee?.designation || '-'}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <div className="flex justify-between"><span className="text-slate-500">Bank Name</span> <span className="font-medium text-right">{financials?.bankName || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Bank A/c</span> <span className="font-medium text-right">{financials?.bankAccountNumber || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Bank IFSC</span> <span className="font-medium text-right">{financials?.bankIfscCode || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">PAN #</span> <span className="font-medium text-right">{financials?.panNumber || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">AADHAAR #</span> <span className="font-medium text-right">{financials?.aadhaarNumber || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Tax Regime</span> <span className="font-medium text-right">Old</span></div>
            <div className="flex justify-between"><span className="text-slate-500">PF A/c #</span> <span className="font-medium text-right">-</span></div>
            <div className="flex justify-between"><span className="text-slate-500">PF UAN #</span> <span className="font-medium text-right">{financials?.uanNumber || '-'}</span></div>
          </div>
        </div>

        <div className="flex gap-6 mb-6 text-sm">
          <div className="w-1/2">
            <h3 className="font-bold mb-3 tracking-wide uppercase border-b-2 border-slate-900 pb-2 text-xs">Earnings & Allowances</h3>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between"><span className="text-slate-600">Basic</span> <span className="font-medium">{formatCurrency(basic)}</span></div>
              {hra > 0 && <div className="flex justify-between"><span className="text-slate-600">HRA</span> <span className="font-medium">{formatCurrency(hra)}</span></div>}
              {special > 0 && <div className="flex justify-between"><span className="text-slate-600">Special Allowance</span> <span className="font-medium">{formatCurrency(special)}</span></div>}
              {transport > 0 && <div className="flex justify-between"><span className="text-slate-600">Transport Allowance</span> <span className="font-medium">{formatCurrency(transport)}</span></div>}
              {telephone > 0 && <div className="flex justify-between"><span className="text-slate-600">Telephone Allowance</span> <span className="font-medium">{formatCurrency(telephone)}</span></div>}
              {bonus > 0 && <div className="flex justify-between"><span className="text-slate-600">Bonus</span> <span className="font-medium">{formatCurrency(bonus)}</span></div>}
            </div>
            <div className="flex justify-between font-bold border-t border-slate-200 pt-2 bg-slate-50 px-2 -mx-2 rounded">
              <span>Gross Earnings</span>
              <span>{formatCurrency(totalEarnings)}</span>
            </div>
          </div>

          <div className="w-1/2">
            <h3 className="font-bold mb-3 tracking-wide uppercase border-b-2 border-slate-900 pb-2 text-xs">Deductions</h3>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between"><span className="text-slate-600">Company Deduction</span> <span className="font-medium">{formatCurrency(companyDeduction)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Loss of Pay (LOP)</span> <span className="font-medium">{lossOfPay > 0 ? formatCurrency(lossOfPay) : '-'}</span></div>
            </div>
            <div className="flex justify-between font-bold border-t border-slate-200 pt-2 bg-slate-50 px-2 -mx-2 rounded">
              <span>Total Deductions</span>
              <span>{formatCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-slate-900">
          <div>
            <p className="text-slate-800 text-sm font-bold uppercase tracking-wide">Net Payable Salary</p>
            <p className="text-xs text-slate-500">Amount transferred to bank account</p>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(netAmount)}
          </div>
        </div>

        {/* Footer (commented out for a few days) */}
        <div className="mt-12 pt-4 border-t border-slate-200 text-[11px] text-slate-400 flex justify-between items-center">
          <p>This is a system generated payslip and does not require a signature.</p>
          <div className="flex items-center gap-1 font-semibold">
            <span>© {new Date().getFullYear()}</span> <span className="text-slate-600">gkeliteinfo</span>
          </div>
        </div>
      </div>

      <PrintButton fileName={`Payslip_${employeeName.replace(/\s+/g, '_')}_${payslip.month}_${payslip.year}`} />
    </div>
  );
}

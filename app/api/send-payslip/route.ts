import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import { getPayslipById } from "@/lib/helpers/employeePayslips";
import { getEmployeeById } from "@/lib/helpers/employees";
import { getEmployeeFinancials } from "@/lib/helpers/employeeFinancials";
import { getEmployeeAddresses } from "@/lib/helpers/employeeAddresses";
import PayslipEmail from "@/components/emails/PayslipEmail";

import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { employeeId, employeePayslipId } = await req.json();

    if (!employeeId || !employeePayslipId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch required data
    const payslip = await getPayslipById(supabase, employeePayslipId);
    if (!payslip) {
      return NextResponse.json({ error: "Payslip not found" }, { status: 404 });
    }

    const employee = await getEmployeeById(supabase, employeeId);
    if (!employee || !employee.email) {
      return NextResponse.json({ error: "Employee or email not found" }, { status: 404 });
    }

    const financials = await getEmployeeFinancials(supabase, employeeId);
    const addresses = await getEmployeeAddresses(supabase, employeeId);
    const address = addresses?.[0];

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Build the email
    const htmlBody = await render(
      PayslipEmail({
        payslip,
        employee,
        financials,
        address,
      })
    );

    const { data, error } = await resend.emails.send({
      from: `GK Elite Info <${fromEmail}>`,
      to: [employee.email],
      subject: `Payslip - ${payslip.month} ${payslip.year}`,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Failed to send payslip email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Row,
  Column,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface PayslipEmailProps {
  payslip: any;
  employee: any;
  financials: any;
  address: any;
}

export const PayslipEmail = ({
  payslip,
  employee,
  financials,
  address,
}: PayslipEmailProps) => {
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
  };

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-50 text-slate-900 font-sans p-4">
          <Container className="bg-white p-8 max-w-2xl mx-auto border border-slate-200">
            {/* Header */}
            <Section className="text-center mb-6 pb-4 border-b-2 border-slate-200">
              <Text className="text-2xl font-black tracking-tight text-slate-900 m-0">GK ELITE INFO LLP</Text>
              <Text className="text-xs text-slate-500 mb-4 mt-2">
                6-3-853/1, 306B, Opp Metro Pillar: 1432, Ameerpet, Hyderabad, TS 500016 | Ph: 9000266832
              </Text>
              <Section className="bg-slate-100 px-6 py-2 rounded-full inline-block">
                <Text className="text-base font-bold tracking-widest text-slate-800 m-0 text-center">PAYSLIP</Text>
                <Text className="text-xs font-semibold text-slate-500 mt-1 mb-0 text-center">
                  {formatDate(fromDate)} - {formatDate(toDate)}
                </Text>
              </Section>
            </Section>

            {/* Employee Details */}
            <Section className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <Row className="mb-4 pb-4 border-b border-slate-200">
                <Column>
                  <Text className="font-bold text-base text-slate-800 m-0">{employeeName}</Text>
                  {address ? (
                    <Text className="text-slate-500 mt-1 mb-0 text-xs">
                      {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                      {address.city}, {address.state} {address.zipCode}
                    </Text>
                  ) : (
                    <Text className="text-slate-500 mt-1 mb-0 text-xs">Address not on file</Text>
                  )}
                  <Text className="text-slate-500 mt-1 mb-0 text-xs">Phone: {mobile}</Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-xs text-slate-500">Employee ID: <span className="font-bold text-slate-800">{employee?.employeeSerialNo || '-'}</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">Date of Joining: <span className="font-bold text-slate-800">{employee?.joinedAt ? new Date(employee.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">Designation: <span className="font-bold text-slate-800">{employee?.designation || '-'}</span></Text>
                </Column>
              </Row>

              <Row>
                <Column>
                  <Text className="m-0 text-xs text-slate-500">Bank Name: <span className="font-medium text-slate-800">{financials?.bankName || '-'}</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">Bank A/c: <span className="font-medium text-slate-800">{financials?.bankAccountNumber || '-'}</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">Bank IFSC: <span className="font-medium text-slate-800">{financials?.bankIfscCode || '-'}</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">PAN #: <span className="font-medium text-slate-800">{financials?.panNumber || '-'}</span></Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-xs text-slate-500">AADHAAR #: <span className="font-medium text-slate-800">{financials?.aadhaarNumber || '-'}</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">Tax Regime: <span className="font-medium text-slate-800">Old</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">PF A/c #: <span className="font-medium text-slate-800">-</span></Text>
                  <Text className="m-0 text-xs text-slate-500 mt-1">PF UAN #: <span className="font-medium text-slate-800">{financials?.uanNumber || '-'}</span></Text>
                </Column>
              </Row>
            </Section>

            {/* Earnings and Deductions */}
            <Section>
              <Row>
                <Column style={{ width: '48%', verticalAlign: 'top', paddingRight: '10px' }}>
                  <Text className="font-bold mb-3 tracking-wide uppercase border-b-2 border-slate-900 pb-2 text-xs m-0">Earnings & Allowances</Text>
                  
                  <Row className="mb-2"><Column><Text className="text-slate-600 m-0 text-sm">Basic</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{formatCurrency(basic)}</Text></Column></Row>
                  {hra > 0 && <Row className="mb-2"><Column><Text className="text-slate-600 m-0 text-sm">HRA</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{formatCurrency(hra)}</Text></Column></Row>}
                  {special > 0 && <Row className="mb-2"><Column><Text className="text-slate-600 m-0 text-sm">Special Allowance</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{formatCurrency(special)}</Text></Column></Row>}
                  {transport > 0 && <Row className="mb-2"><Column><Text className="text-slate-600 m-0 text-sm">Transport Allowance</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{formatCurrency(transport)}</Text></Column></Row>}
                  {telephone > 0 && <Row className="mb-2"><Column><Text className="text-slate-600 m-0 text-sm">Telephone Allowance</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{formatCurrency(telephone)}</Text></Column></Row>}
                  {bonus > 0 && <Row className="mb-4"><Column><Text className="text-slate-600 m-0 text-sm">Bonus</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{formatCurrency(bonus)}</Text></Column></Row>}
                  
                  <Row className="font-bold border-t border-slate-200 pt-2 bg-slate-50 p-2 rounded mt-2">
                    <Column><Text className="m-0 text-sm">Gross Earnings</Text></Column>
                    <Column align="right"><Text className="m-0 text-sm">{formatCurrency(totalEarnings)}</Text></Column>
                  </Row>
                </Column>
                <Column style={{ width: '4%' }}></Column>
                <Column style={{ width: '48%', verticalAlign: 'top', paddingLeft: '10px' }}>
                  <Text className="font-bold mb-3 tracking-wide uppercase border-b-2 border-slate-900 pb-2 text-xs m-0">Deductions</Text>
                  
                  <Row className="mb-2"><Column><Text className="text-slate-600 m-0 text-sm">Company Deduction</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{formatCurrency(companyDeduction)}</Text></Column></Row>
                  <Row className="mb-4"><Column><Text className="text-slate-600 m-0 text-sm">Loss of Pay (LOP)</Text></Column><Column align="right"><Text className="font-medium m-0 text-sm">{lossOfPay > 0 ? formatCurrency(lossOfPay) : '-'}</Text></Column></Row>
                  
                  <Row className="font-bold border-t border-slate-200 pt-2 bg-slate-50 p-2 rounded mt-2">
                    <Column><Text className="m-0 text-sm">Total Deductions</Text></Column>
                    <Column align="right"><Text className="m-0 text-sm">{formatCurrency(totalDeductions)}</Text></Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* Net Salary */}
            <Section className="mt-6 pt-4 border-t-2 border-slate-900">
              <Row>
                <Column>
                  <Text className="text-slate-800 text-sm font-bold uppercase tracking-wide m-0">Net Payable Salary</Text>
                  <Text className="text-xs text-slate-500 m-0">Amount transferred to bank account</Text>
                </Column>
                <Column align="right">
                  <Text className="text-2xl font-black text-slate-900 tracking-tight m-0">
                    {formatCurrency(netAmount)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mt-12 pt-4 border-t border-slate-200">
              <Text className="text-[11px] text-slate-400 text-center m-0">
                This is a system generated payslip and does not require a signature. <br />
                © {new Date().getFullYear()} gkeliteinfo
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PayslipEmail;

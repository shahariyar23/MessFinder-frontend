import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";

export default function PaymentsHistory() {
  // Example data
  const paymentHistory = [
    {
      date: "2024-07-20",
      desc: "Rent Payment - Campus View Apartments",
      amount: "$550.00",
      status: "Completed"
    },
    {
      date: "2024-06-20",
      desc: "Rent Payment - Campus View Apartments",
      amount: "$550.00",
      status: "Completed"
    },
    {
      date: "2024-05-20",
      desc: "Rent Payment - Campus View Apartments",
      amount: "$550.00",
      status: "Completed"
    },
    {
      date: "2024-04-20",
      desc: "Rent Payment - Campus View Apartments",
      amount: "$550.00",
      status: "Completed"
    },
    {
      date: "2024-03-20",
      desc: "Rent Payment - Campus View Apartments",
      amount: "$550.00",
      status: "Rejected"
    },
  ];

  const upcomingPayments = [
    {
      date: "2024-08-20",
      desc: "Rent Payment - Campus View Apartments",
      amount: "$550.00",
      due: "2024-08-20"
    },
  ];

  const paymentMethods = [
    {
      logo: "/visa.svg",
      label: "Credit Card",
      details: "Visa **** 1234",
    },
    {
      logo: "/paypal.svg",
      label: "PayPal",
      details: "PayPal Account",
    },
  ];

  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">Payments Overview</p>
      </div>
      {/* Payment History */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Payment History</h2>
      <div className="px-4 py-3">
        <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Date</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-52">Description</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Amount</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((row, idx) => (
                <TableRow key={idx} className="border-t border-[#cfdfe7]">
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.date}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.desc}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.amount}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 w-32">
                    <button className="flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center rounded-lg h-8 px-4 bg-[#e7eff3] text-[#0d171b] text-sm font-medium w-full">

                      <span
                        className={`truncate ${row.status.toLowerCase() === "completed"
                            ? " text-green-700"
                            : (row.status.toLowerCase() === "pending")
                              ? " text-red-700"
                              : "text-red-400"
                          }`}>{row.status}</span>
                  </button>
                </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
      {/* Upcoming Payments */ }
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Upcoming Payments</h2>
      <div className="px-4 py-3">
        <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Date</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-52">Description</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Amount</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingPayments.map((row, idx) => (
                <TableRow key={idx} className="border-t border-[#cfdfe7]">
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.date}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.desc}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.amount}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.due}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  {/* Payment Methods */ }
  <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Payment Methods</h2>
  {
    paymentMethods.map((method, idx) => (
      <div key={method.label} className="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between">
        <div className="flex items-center gap-4">
          <div
            className="bg-center bg-no-repeat aspect-video bg-contain h-6 w-10 shrink-0"
            style={{ backgroundImage: `url('${method.logo}')` }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-[#0d171b] text-base font-medium line-clamp-1">{method.label}</p>
            <p className="text-[#4c809a] text-sm font-normal line-clamp-2">{method.details}</p>
          </div>
        </div>
        <div className="shrink-0 flex size-7 items-center justify-center">
          <Pencil size={24} className="text-[#0d171b]" />
        </div>
      </div>
    ))
  }
  <div className="flex px-4 py-3 justify-start">
    <button className="flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#13a4ec] text-slate-50 text-sm font-bold tracking-wide">
      <span className="truncate">Add Payment Method</span>
    </button>
  </div>
    </div >
  );
}

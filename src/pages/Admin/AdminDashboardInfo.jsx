import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const recentActivity = [
  { user: "Liam Harper", action: "Created new mess listing", time: "2023-11-15 10:30 AM" },
  { user: "Olivia Bennett", action: "Updated mess listing details", time: "2023-11-15 09:45 AM" },
  { user: "Noah Carter", action: "Approved mess owner application", time: "2023-11-14 04:20 PM" },
  { user: "Isabella Foster", action: "Reviewed payment transaction", time: "2023-11-14 02:15 PM" },
  { user: "Ethan Hayes", action: "Monitored user activity", time: "2023-11-13 11:50 AM" },
];

const AdminDashboardInfo = () => {
    return (
        <div>
            <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#0d171b] text-[32px] font-bold min-w-44 tracking-tight">Dashboard</p>
            </div>
            <div className="flex flex-wrap gap-4 p-4">
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7eff3]">
                    <p className="text-[#0d171b] text-base font-medium">Total Mess Listings</p>
                    <p className="text-[#0d171b] text-2xl font-bold">125</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7eff3]">
                    <p className="text-[#0d171b] text-base font-medium">Active Users</p>
                    <p className="text-[#0d171b] text-2xl font-bold">350</p>
                </div>
                <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7eff3]">
                    <p className="text-[#0d171b] text-base font-medium">Pending Approvals</p>
                    <p className="text-[#0d171b] text-2xl font-bold">15</p>
                </div>
            </div>
            <h2 className="text-[#0d171b] text-[22px] font-bold px-4 pb-3 pt-5">Recent Activity</h2>
            <div className="px-2 sm:px-4 py-3 overflow-x-auto">
                <Table className="min-w-full border border-[#cfdfe7] rounded-lg bg-slate-50">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-4 py-3 text-left text-[#0d171b] w-32 sm:w-52">User</TableHead>
                            <TableHead className="px-4 py-3 text-left text-[#0d171b] w-32 sm:w-52">Action</TableHead>
                            <TableHead className="px-4 py-3 text-left text-[#0d171b] w-32 sm:w-52">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentActivity.map(row => (
                            <TableRow key={row.time} className="border-t border-[#cfdfe7]">
                                <TableCell className="h-12 px-4 py-2 text-[#0d171b] text-sm">{row.user}</TableCell>
                                <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">{row.action}</TableCell>
                                <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">{row.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <h2 className="text-[#0d171b] text-[22px] font-bold px-4 pb-3 pt-5">Mess Listings Overview</h2>
            <div className="flex flex-wrap gap-4 px-2 sm:px-4 py-4">
                <div className="flex flex-1 flex-col gap-2 min-w-[220px] rounded-lg border border-[#cfdfe7] p-6">
                    <p className="text-[#0d171b] text-base font-medium">Mess Listings by Location</p>
                    <p className="text-[#0d171b] text-2xl font-bold truncate">125</p>
                    <div className="flex gap-1">
                        <p className="text-[#4c809a] text-base font-normal">Total</p>
                        <p className="text-[#078836] text-base font-medium">+10%</p>
                    </div>
                    <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-2 items-center py-3">
                        <p className="text-[#4c809a] text-[13px] font-bold">Downtown</p>
                        <div className="h-4 flex items-center"><div className="bg-[#e7eff3] border-[#4c809a] border-r-2 h-full" style={{ width: '30%' }} /></div>
                        <p className="text-[#4c809a] text-[13px] font-bold">Uptown</p>
                        <div className="h-4 flex items-center"><div className="bg-[#e7eff3] border-[#4c809a] border-r-2 h-full" style={{ width: '30%' }} /></div>
                        <p className="text-[#4c809a] text-[13px] font-bold">Suburb</p>
                        <div className="h-4 flex items-center"><div className="bg-[#e7eff3] border-[#4c809a] border-r-2 h-full" style={{ width: '50%' }} /></div>
                        <p className="text-[#4c809a] text-[13px] font-bold">Campus</p>
                        <div className="h-4 flex items-center"><div className="bg-[#e7eff3] border-[#4c809a] border-r-2 h-full" style={{ width: '10%' }} /></div>
                    </div>
                </div>
            </div>
        </div>)

}

export default AdminDashboardInfo;
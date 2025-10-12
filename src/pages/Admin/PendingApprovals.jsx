import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Search } from "lucide-react";

export default function PendingApprovals() {
    // Example data
    const approvals = [
        {
            item: "New Mess Listing",
            details: "Cozy Corner Mess - 4 beds",
            submitter: "Liam Carter",
            date: "2024-07-26",
            actions: "Approve/Reject",
        },
        {
            item: "Updated Owner Profile",
            details: "Profile update for Olivia Hayes",
            submitter: "Olivia Hayes",
            date: "2024-07-25",
            actions: "Approve/Reject",
        },
        {
            item: "User Review",
            details: "Review by Ava Bennett for The Student Hub",
            submitter: "Ava Bennett",
            date: "2024-07-24",
            actions: "Approve/Reject",
        },
        {
            item: "New Mess Listing",
            details: "The Student Hub - 6 beds",
            submitter: "Ethan Harper",
            date: "2024-07-23",
            actions: "Approve/Reject",
        },
        {
            item: "Updated Owner Profile",
            details: "Profile update for Isabella Reed",
            submitter: "Isabella Reed",
            date: "2024-07-22",
            actions: "Approve/Reject",
        },
        {
            item: "User Review",
            details: "Review by Jackson Turner for Cozy Corner Mess",
            submitter: "Jackson Turner",
            date: "2024-07-21",
            actions: "Approve/Reject",
        },
        {
            item: "New Mess Listing",
            details: "Student Haven - 5 beds",
            submitter: "Mia Mitchell",
            date: "2024-07-20",
            actions: "Approve/Reject",
        },
        {
            item: "Updated Owner Profile",
            details: "Profile update for Caleb Bennett",
            submitter: "Caleb Bennett",
            date: "2024-07-19",
            actions: "Reject",
        },
        {
            item: "User Review",
            details: "Review by Chloe Foster for Student Haven",
            submitter: "Chloe Foster",
            date: "2024-07-18",
            actions: "Approve",
        },
        {
            item: "New Mess Listing",
            details: "The Study Spot - 3 beds",
            submitter: "Noah Carter",
            date: "2024-07-17",
            actions: "Approve/Reject",
        },
    ];

    return (
        <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
            <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">Pending Approvals</p>
            </div>
            {/* Search */}
            <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full items-stretch rounded-lg h-full">
                        <div className="flex items-center pl-4 bg-[#e7eff3] rounded-l-lg">
                            <Search size={24} className="text-[#4c809a]" />
                        </div>
                        <input
                            placeholder="Search approvals..."
                            className="flex w-full min-w-0 flex-1 rounded-lg border-none bg-[#e7eff3] text-[#0d171b] placeholder:text-[#4c809a] px-4 h-full focus:outline-none rounded-l-none"
                        />
                    </div>
                </label>
            </div>
            {/* Filter */}
            <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Filter Options</h2>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                    <select className="flex w-full min-w-0 rounded-lg text-[#0d171b] border border-[#cfdfe7] bg-slate-50 h-14 px-4 text-base font-normal focus:outline-none">
                        <option value="">Select Type</option>
                        <option value="mess">Mess Listing</option>
                        <option value="owner">Owner Profile</option>
                        <option value="review">User Review</option>
                    </select>
                </label>
            </div>
            <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Items Awaiting Approval</h2>
            <div className="px-4 py-3">
                <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Item</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-52">Details</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Submitted By</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Date</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#4c809a] text-sm font-medium w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approvals.map((row, idx) => (
                                <TableRow key={idx} className="border-t border-[#cfdfe7]">
                                    <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">{row.item}</TableCell>
                                    <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.details}</TableCell>
                                    <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.submitter}</TableCell>
                                    <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.date}</TableCell>
                                    <TableCell className="h-[72px] px-4 py-2 w-32 text-[#4c809a] text-sm font-bold tracking-wide cursor-pointer">
                                        <span
                                            className={`truncate ${row.status?.toLowerCase() === "approve"
                                                    ? " text-green-700"
                                                    : (row.status?.toLowerCase() === "reject")
                                                        ? " text-red-700"
                                                        : ""
                                                }`}
                                        >
                                            {row.status}
                                        </span>

                                        {row.actions}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Link } from "react-router";

const UserListing = ({users, user}) => {
    const handleClick = () => {
        alert("Action performed!");
    }
  return <>
  <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full items-stretch rounded-lg h-full">
                        <div className="flex items-center pl-4 bg-[#e7eff3] rounded-l-lg">
                            <Search size={24} className="text-[#4c809a]" />
                        </div>
                        <input
                            placeholder="Search owners..."
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
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </label>
            </div>
            <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">{user} Overview</h2>
            <div className="px-4 py-3">
                <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">{user} Name</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Contact</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Listings</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Status</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#4c809a] text-sm font-medium w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((row, idx) => (
                                <TableRow key={idx} className="border-t border-[#cfdfe7]">
                                    <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">{row.name}</TableCell>
                                    <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">
                                        <a href={`mailto:${row.contact}`} className="hover:underline">
                                            {row.contact}
                                        </a>
                                    </TableCell>
                                    <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.listings}</TableCell>
                                    <TableCell className="h-[72px] px-4 py-2 w-32">
                                        <button className={`flex min-w-[84px] max-w-xs items-center justify-center rounded-lg h-8 px-4 ${row.statusColor} text-[#0d171b] text-sm font-medium w-full`}>
                                            <span
                                                className={`truncate ${row.status.toLowerCase() === "active"
                                                        ? " text-green-700"
                                                        : (row.status.toLowerCase() === "suspended" || row.status.toLowerCase() === "block")
                                                            ? " text-red-700"
                                                            : ""
                                                    }`}
                                            >
                                                {row.status}
                                            </span>

                                        </button>
                                    </TableCell>
                                    <TableCell onClick={() => handleClick()} className="h-[72px] px-4 py-2 w-32 text-[#4c809a] text-sm font-bold tracking-wide cursor-pointer">
                                        
                                            {row.status === "Active" ? "Suspended" : "Activate"}
                                       
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
  </>
}


export default UserListing;
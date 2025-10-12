import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Search } from "lucide-react";

export default function MessListings() {
  // Dummy data example
  const listings = [
    {
      name: "Cozy Student House",
      location: "Downtown",
      status: "Approved",
      owner: "Ethan Harper",
    },
    {
      name: "Campus View Apartments",
      location: "Campus",
      status: "Pending",
      owner: "Olivia Hayes",
    },
    {
      name: "Suburb Shared Mess",
      location: "Suburb",
      status: "Approved",
      owner: "Noah Carter",
    },
    {
      name: "Uptown Living Quarters",
      location: "Uptown",
      status: "Approved",
      owner: "Ava Bennett",
    },
    // ...more rows
  ];

  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">Mess Listings</p>
      </div>
      {/* Search input */}
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full items-stretch rounded-lg h-full">
            <div className="flex items-center pl-4 bg-[#e7eff3] rounded-l-lg">
              <Search size={24} className="text-[#4c809a]" />
            </div>
            <input
              placeholder="Search mess listings..."
              className="flex w-full min-w-0 flex-1 rounded-lg border-none bg-[#e7eff3] text-[#0d171b] placeholder:text-[#4c809a] px-4 h-full focus:outline-none rounded-l-none"
            />
          </div>
        </label>
      </div>
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Filter Options</h2>
      {/* Filter Selects */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <select className="flex w-full min-w-0 flex-1 rounded-lg text-[#0d171b] border border-[#cfdfe7] bg-slate-50 h-14 px-4 text-base font-normal focus:outline-none">
            <option value="">Select Location</option>
            <option value="downtown">Downtown</option>
            <option value="campus">Campus</option>
            <option value="uptown">Uptown</option>
            <option value="suburb">Suburb</option>
          </select>
        </label>
        <label className="flex flex-col min-w-40 flex-1">
          <select className="flex w-full min-w-0 flex-1 rounded-lg text-[#0d171b] border border-[#cfdfe7] bg-slate-50 h-14 px-4 text-base font-normal focus:outline-none">
            <option value="">Select Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        <label className="flex flex-col min-w-40 flex-1">
          <select className="flex w-full min-w-0 flex-1 rounded-lg text-[#0d171b] border border-[#cfdfe7] bg-slate-50 h-14 px-4 text-base font-normal focus:outline-none">
            <option value="">Select Owner</option>
            <option value="olivia">Olivia Hayes</option>
            <option value="ava">Ava Bennett</option>
            <option value="ethan">Ethan Harper</option>
          </select>
        </label>
      </div>
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Mess Listings Overview</h2>
      <div className="px-4 py-3">
        <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Listing Name</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Location</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Status</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((row, idx) => (
                <TableRow key={idx} className="border-t border-[#cfdfe7]">
                  <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">{row.name}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.location}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 w-32">
                    <button className="flex min-w-[84px] max-w-xs items-center justify-center rounded-lg h-8 px-4 bg-[#e7eff3] text-[#0d171b] text-sm font-medium w-full">
                      <span
  className={`truncate ${
    row.status.toLowerCase() === "approved"
      ? " text-green-700"
      : (row.status.toLowerCase() === "pending")
      ? " text-red-400"
      : " text-red-700"
  }`}
>
  {row.status}
</span>

                    </button>
                  </TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

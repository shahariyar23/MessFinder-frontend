import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function AdminUserProfile() {
  // Example listings data
  const listings = [
    {
      name: "Cozy Student Mess",
      address: "123 Elm Street, Anytown",
      status: "Active",
      action: "View Details",
    },
    {
      name: "Student Haven",
      address: "456 Oak Avenue, Anytown",
      status: "Active",
      action: "View Details",
    },
    {
      name: "The Study Spot",
      address: "789 Pine Lane, Anytown",
      status: "Pending",
      action: "View Details",
    },
  ];

  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">Owner Profile: Ryan Carter</p>
      </div>

      {/* Avatar and Name */}
      <div className="flex p-4">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUIk9LOb8QGCJ_kHB3GTNfeacCgMKMn1XgCxtE37cN7bqldWWv4EV6yK9-alGWAL3kl7BcNrxG-i0e_Qilbc2_RFvyOw1Qerp8UYSGlN-VzG8d2ze_X80NGeiXlUwuFnOZQ3FdCAfkVd3uAtx3dGpRZJEZnkarfYBxSXQPnwP7UIy7FhJcjXH9gMEwfKdELIbJ1rhn3zVuTK2SdT7uv_wkID6bBSGPvc8QE6jDRamYJzMS4pwPNDsQLwjSPoJ9YeNbLMg3fYff0RU")'
              }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em]">Ryan Carter</p>
              <p className="text-[#4c809a] text-base font-normal leading-normal">Owner ID: 12345</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Contact Information</h2>
      <div className="p-4 grid grid-cols-[25%_1fr] gap-x-6">
        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#cfdfe7] py-5">
          <p className="text-[#4c809a] text-sm font-normal">Phone</p>
          <p className="text-[#0d171b] text-sm font-normal">(555) 123-4567</p>
        </div>
        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#cfdfe7] py-5">
          <p className="text-[#4c809a] text-sm font-normal">Email</p>
          <p className="text-[#0d171b] text-sm font-normal">ryan.carter@email.com</p>
        </div>
      </div>

      {/* Listings Table */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Listings</h2>
      <div className="px-4 py-3">
        <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Listing Name</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-52">Address</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Status</TableHead>
                <TableHead className="px-4 py-3 text-left text-[#4c809a] text-sm font-medium w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((row, idx) => (
                <TableRow key={idx} className="border-t border-[#cfdfe7]">
                  <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">{row.name}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">{row.address}</TableCell>
                  <TableCell className="h-[72px] px-4 py-2 w-32">
                    <button
                      className={`flex min-w-[84px] max-w-xs items-center justify-center rounded-lg h-8 px-4 ${row.status.toLowerCase() === "active"
                          ? "bg-green-100 text-green-700"
                          : row.status.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        } text-sm font-medium w-full`}
                    >
                      <span className="truncate">{row.status}</span>
                    </button>
                  </TableCell>
                  <TableCell className="h-[72px] px-4 py-2 w-32 text-[#4c809a] text-sm font-bold tracking-wide cursor-pointer">
                    {"Active" ? "Suspended" : "Active"}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Performance Metrics */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Performance Metrics</h2>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cfdfe7]">
          <p className="text-[#0d171b] text-base font-medium">Total Listings</p>
          <p className="text-[#0d171b] text-2xl font-bold">3</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cfdfe7]">
          <p className="text-[#0d171b] text-base font-medium">Active Listings</p>
          <p className="text-[#0d171b] text-2xl font-bold">2</p>
        </div>
      </div>
    </div>
  );
}

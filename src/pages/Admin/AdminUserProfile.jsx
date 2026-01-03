import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router";
import { getUserById, selectCurrentUser, selectUsersLoading, selectUsersError } from "@/store/admin/usersSlice";
import { Badge } from "@/components/ui/badge";

export default function AdminUserProfile() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  const avatarUrl =
    user?.avatar ||
    user?.photo ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUIk9LOb8QGCJ_kHB3GTNfeacCgMKMn1XgCxtE37cN7bqldWWv4EV6yK9-alGWAL3kl7BcNrxG-i0e_Qilbc2_RFvyOw1Qerp8UYSGlN-VzG8d2ze_X80NGeiXlUwuFnOZQ3FdCAfkVd3uAtx3dGpRZJEZnkarfYBxSXQPnwP7UIy7FhJcjXH9gMEwfKdELIbJ1rhn3zVuTK2SdT7uv_wkID6bBSGPvc8QE6jDRamYJzMS4pwPNDsQLwjSPoJ9YeNbLMg3fYff0RU";

  const isOwner = user?.role === "owner";
  const isStudent = user?.role === "student";
  const listings = Array.isArray(user?.listings)
    ? user.listings
    : Array.isArray(user?.messes)
    ? user.messes
    : [];
  const bookings = Array.isArray(user?.bookings) ? user.bookings : [];

  const totalListings =
    (Array.isArray(user?.listings) ? user.listings.length : 0) ||
    (Array.isArray(user?.messes) ? user.messes.length : 0);
  const activeListingsCount = Array.isArray(listings)
    ? listings.filter((l) => (l.isActive === true) || (String(l.status || "").toLowerCase() === "active")).length
    : 0;

  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">
          {user?.name || "User Profile"}
        </p>
        <Badge variant="outline" className="h-8">
          {user?.role || "unknown"}
        </Badge>
      </div>

      <div className="flex p-4">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
              style={{ backgroundImage: `url("${avatarUrl}")` }}
            ></div>
            <div className="flex flex-col justify-center">
              <p className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                {user?.name || "Unknown"}
              </p>
              <p className="text-[#4c809a] text-base font-normal leading-normal">
                {user?._id || user?.id || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Contact Information</h2>
      <div className="p-4 grid grid-cols-[25%_1fr] gap-x-6">
        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#cfdfe7] py-5">
          <p className="text-[#4c809a] text-sm font-normal">Phone</p>
          <p className="text-[#0d171b] text-sm font-normal">{user?.phone || "N/A"}</p>
        </div>
        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#cfdfe7] py-5">
          <p className="text-[#4c809a] text-sm font-normal">Email</p>
          <p className="text-[#0d171b] text-sm font-normal">{user?.email || "N/A"}</p>
        </div>
        <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#cfdfe7] py-5">
          <p className="text-[#4c809a] text-sm font-normal">Status</p>
          <p className="text-[#0d171b] text-sm font-normal">
            {user?.isActive === false ? "Suspended" : "Active"}
          </p>
        </div>
      </div>

      {loading && (
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-44 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-700 font-medium">{String(error)}</span>
          </div>
        </div>
      )}

      {isOwner && (
        <>
          <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Listings</h2>
          <div className="px-4 py-3">
            <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Listing</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-52">Address</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(listings) && listings.length > 0 ? (
                    listings.map((row, idx) => (
                      <TableRow key={idx} className="border-t border-[#cfdfe7]">
                        <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">
                          {row.title || row.name || "N/A"}
                        </TableCell>
                        <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">
                          {row.address || "N/A"}
                        </TableCell>
                        <TableCell className="h-[72px] px-4 py-2 w-32">
                          <span className={`inline-flex items-center justify-center rounded-lg h-8 px-4 text-sm font-medium ${
                            (row.isActive === true || String(row.status || "").toLowerCase() === "active")
                              ? "bg-green-100 text-green-700"
                              : String(row.status || "").toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {row.isActive === true ? "Active" : row.status || "Inactive"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-gray-500">No listings</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {isStudent && (
        <>
          <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Bookings</h2>
          <div className="px-4 py-3">
            <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Mess</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Booking</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Payment</TableHead>
                    <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(bookings) && bookings.length > 0 ? (
                    bookings.map((b, idx) => (
                      <TableRow key={idx} className="border-t border-[#cfdfe7]">
                        <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">
                          {b?.mess?.title || "N/A"}
                        </TableCell>
                        <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">
                          {b?.bookingStatus || "N/A"}
                        </TableCell>
                        <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">
                          {b?.paymentStatus || "N/A"}
                        </TableCell>
                        <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">
                          {typeof b?.payAbleAmount === "number" ? `৳${b.payAbleAmount.toLocaleString()}` : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-gray-500">No bookings</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {!isOwner && !isStudent && (
        <>
          <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Overview</h2>
          <div className="flex flex-wrap gap-4 p-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cfdfe7]">
              <p className="text-[#0d171b] text-base font-medium">Total Listings</p>
              <p className="text-[#0d171b] text-2xl font-bold">{totalListings || 0}</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#cfdfe7]">
              <p className="text-[#0d171b] text-base font-medium">Active Listings</p>
              <p className="text-[#0d171b] text-2xl font-bold">{activeListingsCount || 0}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

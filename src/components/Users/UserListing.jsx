import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

const UserListing = ({ 
    users, 
    user, 
    pagination, 
    onPageChange, 
    onDeleteUser, 
    onStatusChange,
    loading 
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Debug: Log the incoming data
    // console.log("DEBUG - UserListing received:", users);

    // Filter users based on search term and status
    useEffect(() => {
        let filtered = users;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(user => 
                statusFilter === "active" ? user.status === "Active" : 
                statusFilter === "suspended" ? user.status === "Suspended" : true
            );
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, statusFilter]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleStatusToggle = (user) => {
        if (onStatusChange) {
            const newStatus = user.status === "Active" ? "Suspended" : "Active";
            // console.log("DEBUG - Toggling status:", {
            //     userId: user.id,
            //     currentStatus: user.status,
            //     newStatus: newStatus,
            //     userData: user
            // });
            onStatusChange(user.id, newStatus);
        }
    };

    const handleDelete = (userId) => {
        if (onDeleteUser) {
            onDeleteUser(userId);
        }
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === "active") return "bg-green-100 text-green-700";
        if (statusLower === "suspended" || statusLower === "block") return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <>
            <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full items-stretch rounded-lg h-full">
                        <div className="flex items-center pl-4 bg-[#e7eff3] rounded-l-lg">
                            <Search size={24} className="text-[#4c809a]" />
                        </div>
                        <input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="flex w-full min-w-0 flex-1 rounded-lg border-none bg-[#e7eff3] text-[#0d171b] placeholder:text-[#4c809a] px-4 h-full focus:outline-none rounded-l-none"
                        />
                    </div>
                </label>
            </div>
            
            {/* Filter */}
            <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Filter Options</h2>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                    <select 
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="flex w-full min-w-0 rounded-lg text-[#0d171b] border border-[#cfdfe7] bg-slate-50 h-14 px-4 text-base font-normal focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </label>
            </div>

            <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
                {user} Overview {filteredUsers.length > 0 && `(${filteredUsers.length})`}
            </h2>
            
            <div className="px-4 py-3">
                <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">{user} Name</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">Contact</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-44">{user == "Owners" ? "Listing" : "Booking"}</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium w-32">Status</TableHead>
                                <TableHead className="px-4 py-3 text-left text-[#4c809a] text-sm font-medium w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                        No {user.toLowerCase()} found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((row, idx) => {
                                    // console.log("DEBUG - Rendering row:", row);
                                    return (
                                        <TableRow key={row.id || idx} className="border-t border-[#cfdfe7]">
                                            <TableCell className="h-[72px] px-4 py-2 text-[#0d171b] text-sm">
                                                {row.name}
                                            </TableCell>
                                            <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">
                                                <a href={`mailto:${row.contact}`} className="hover:underline">
                                                    {row.contact}
                                                </a>
                                            </TableCell>
                                            <TableCell className="h-[72px] px-4 py-2 text-[#4c809a] text-sm">
                                                {row.listings}
                                            </TableCell>
                                            <TableCell className="h-[72px] px-4 py-2 w-32">
                                                <button className={`flex min-w-[84px] max-w-xs items-center justify-center rounded-lg h-8 px-4 ${getStatusColor(row.status)} text-sm font-medium w-full`}>
                                                    <span className="truncate">
                                                        {row.status}
                                                    </span>
                                                </button>
                                            </TableCell>
                                            <TableCell className="h-[72px] px-4 py-2 w-32">
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleStatusToggle(row)}
                                                        className="text-blue-600 hover:text-blue-900 text-sm font-bold tracking-wide cursor-pointer"
                                                        disabled={loading}
                                                    >
                                                        {row.status === "Active" ? "Suspend" : "Activate"}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(row.id)}
                                                        className="text-red-600 hover:text-red-900 text-sm font-bold tracking-wide cursor-pointer"
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center px-4 py-3">
                    <button
                        onClick={() => onPageChange?.(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev || loading}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                        Previous
                    </button>
                    
                    <span className="text-sm text-gray-600">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                        onClick={() => onPageChange?.(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext || loading}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
};

export default UserListing;
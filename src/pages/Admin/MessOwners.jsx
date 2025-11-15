import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserListing from "@/components/Users/UserListing";
import {
  setFilters,
  clearError,
  selectOwners,
  selectUsersLoading,
  selectUsersError,
  selectOwnerPagination,
  selectFilters,
  selectActionLoading,
  getAllOwners,
  deleteOwner,
  modifyOwner
} from "@/store/admin/usersSlice";
import {
  Search,
  Users,
  Filter,
  Download,
  Plus,
  Loader2,
  FileText,
  ChevronDown,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";

// PDF Export Utility Functions
const exportOwnersToPDF = (owners, filters = {}) => {
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Mess Owners Report", 14, 22);

    // Add date and filters info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    if (filters.search || filters.status) {
      let filterText = "Filters: ";
      if (filters.search) filterText += `Search: "${filters.search}" `;
      if (filters.status) filterText += `Status: ${filters.status}`;
      doc.text(filterText, 14, 38);
    }

    // Prepare table data
    const tableData = owners.map((owner) => [
      owner.name || "N/A",
      owner.email || "N/A",
      owner.phone || "N/A",
      owner.status || "N/A",
      owner.listings || "No listings",
      new Date(owner.createdAt).toLocaleDateString(),
    ]);

    // Simple table implementation without autoTable
    let yPosition = 45;
    const lineHeight = 7;
    const colWidths = [40, 45, 35, 25, 25, 25];

    // Table headers
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255);
    doc.setFont(undefined, "bold");

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Listings",
      "Join Date",
    ];
    let xPosition = 14;

    headers.forEach((header, index) => {
      doc.rect(xPosition, yPosition, colWidths[index], lineHeight, "F");
      doc.text(header, xPosition + 2, yPosition + 5);
      xPosition += colWidths[index];
    });

    yPosition += lineHeight;

    // Table rows
    doc.setFont(undefined, "normal");
    doc.setTextColor(0);

    tableData.forEach((row, rowIndex) => {
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(14, yPosition, 180, lineHeight, "F");
      }

      xPosition = 14;
      row.forEach((cell, cellIndex) => {
        doc.text(cell.toString(), xPosition + 2, yPosition + 5);
        xPosition += colWidths[cellIndex];
      });

      yPosition += lineHeight;

      // Add new page if needed
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Add summary
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Owners: ${owners.length}`, 14, yPosition);

    // Save the PDF
    const fileName = `owners-report-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  });
};

const exportDetailedOwnersToPDF = (
  owners,
  filters = {},
  statistics = {}
) => {
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Detailed Mess Owners Report", 14, 22);

    // Header information
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Date: ${new Date().toLocaleString()}`, 14, 32);
    doc.text(
      `Total Owners: ${statistics.totalOwners || owners.length}`,
      14,
      38
    );

    if (filters.search || filters.status) {
      let filterText = "Applied Filters: ";
      if (filters.search) filterText += `"${filters.search}" `;
      if (filters.status) filterText += `(${filters.status})`;
      doc.text(filterText, 14, 44);
    }

    // Statistics section
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text("Summary Statistics", 14, 55);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(`• Active Owners: ${statistics.activeOwners || 0}`, 20, 65);
    doc.text(
      `• Suspended Owners: ${statistics.suspendedOwners || 0}`,
      20,
      72
    );

    if (statistics.totalOwners && statistics.totalOwners > 0) {
      const activePercentage = Math.round(
        ((statistics.activeOwners || 0) / statistics.totalOwners) * 100
      );
      const suspendedPercentage = Math.round(
        ((statistics.suspendedOwners || 0) / statistics.totalOwners) * 100
      );
      doc.text(`• Active: ${activePercentage}%`, 20, 79);
      doc.text(`• Suspended: ${suspendedPercentage}%`, 20, 86);
    }

    // Owner data table
    const tableData = owners.map((owner, index) => [
      (index + 1).toString(),
      owner.name || "N/A",
      owner.email || "N/A",
      owner.phone || "N/A",
      owner.status || "N/A",
      owner.listings || "No listings",
      new Date(owner.createdAt).toLocaleDateString(),
      owner.isVerified ? "Yes" : "No",
    ]);

    // Simple table implementation
    let yPosition = 95;
    const lineHeight = 7;
    const colWidths = [10, 25, 35, 25, 20, 20, 20, 15];

    // Table headers
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255);
    doc.setFont(undefined, "bold");

    const headers = [
      "#",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Listings",
      "Join Date",
      "Verified",
    ];
    let xPosition = 14;

    headers.forEach((header, index) => {
      doc.rect(xPosition, yPosition, colWidths[index], lineHeight, "F");
      // Truncate long text
      const displayText =
        header.length > 8 ? header.substring(0, 8) + "..." : header;
      doc.text(displayText, xPosition + 1, yPosition + 5);
      xPosition += colWidths[index];
    });

    yPosition += lineHeight;

    // Table rows
    doc.setFont(undefined, "normal");
    doc.setTextColor(0);
    doc.setFontSize(8);

    tableData.forEach((row, rowIndex) => {
      // Alternate row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition, 174, lineHeight, "F");
      }

      xPosition = 14;
      row.forEach((cell, cellIndex) => {
        // Truncate long text
        const displayText =
          cell.length > 15 ? cell.substring(0, 15) + "..." : cell;
        doc.text(displayText, xPosition + 1, yPosition + 5);
        xPosition += colWidths[cellIndex];
      });

      yPosition += lineHeight;

      // Add new page if needed
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        doc.setFontSize(8);
      }
    });

    // Footer
    yPosition += 10;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated by Admin Panel - Page 1 of 1`, 14, yPosition);

    const fileName = `detailed-owners-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  });
};

const MessOwners = () => {
  const dispatch = useDispatch();
  const ownersState = useSelector(selectOwners);
  const loading = useSelector(selectUsersLoading);
  const actionLoading = useSelector(selectActionLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectOwnerPagination);
  const filters = useSelector(selectFilters);

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    dispatch(
      getAllOwners({
        page: 1,
        limit: 10,
        search: filters.search,
        status: filters.status,
        role: "owner"
      })
    );
  }, [dispatch]);

  // Sync local search term with Redux filters
  useEffect(() => {
    setSearchTerm(filters.search || "");
    setStatusFilter(filters.status || "");
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      setFilters({
        search: searchTerm,
        status: statusFilter,
      })
    );
    dispatch(
      getAllOwners({
        page: 1,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
      })
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    dispatch(setFilters({ search: "", status: "" }));
    dispatch(getAllOwners({ page: 1, limit: 10 }));
  };

  const handlePageChange = (page) => {
    dispatch(
      getAllOwners({
        page,
        limit: 10,
        search: filters.search,
        status: filters.status,
      })
    );
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this owner? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await dispatch(deleteOwner(userId)).unwrap();
      toast.success("Owner deleted successfully");

      // Refresh the current page
      dispatch(
        getAllOwners({
          page: pagination.currentPage,
          limit: 10,
          search: filters.search,
          status: filters.status,
        })
      );
    } catch (error) {
      toast.error(error || "Failed to delete owner");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      ////console.log("Changing status for user:", userId, "to:", newStatus);
      
      await dispatch(
        modifyOwner({
          userId,
          userData: { 
            isActive: newStatus === "Active",
            updateMessListings: false
          },
        })
      ).unwrap();

      const action = newStatus === "Active" ? "activated" : "suspended";
      toast.success(`Owner ${action} successfully`);

      // Refresh the current page
      dispatch(
        getAllOwners({
          page: pagination.currentPage,
          limit: 10,
          search: filters.search,
          status: filters.status,
        })
      );
    } catch (error) {
      console.error("Status change error:", error);
      toast.error(error?.message || "Failed to update owner status");
    }
  };

  const handleFullExport = async () => {
    if (ownersState.list.length === 0) {
      toast.warning("No owners data to export");
      return;
    }

    setExportLoading(true);
    setExportDropdownOpen(false);

    try {
      const loadingToast = toast.loading("Generating complete PDF report...");

      // Get all owners data for export (without pagination)
      const result = await dispatch(
        getAllOwners({
          page: 1,
          limit: 1000,
          search: filters.search,
          status: filters.status,
        })
      ).unwrap();

      // Use the returned data or fallback to current list
      const allOwners = result?.users || ownersState.list;

      // Calculate statistics for detailed report
      const statistics = {
        totalOwners: pagination.totalOwners || allOwners.length,
        activeOwners: allOwners.filter(
          (owner) => owner.isActive === true
        ).length,
        suspendedOwners: allOwners.filter(
          (owner) => owner.isActive === false
        ).length,
      };

      // Format owners data for PDF
      const ownersForExport = allOwners.map((owner) => {
        let listingsText = "No listings";

        if (owner.listings && owner.listings !== "") {
          listingsText = owner.listings;
        } else if (owner.listingsCount) {
          listingsText = `${owner.listingsCount} listing${
            owner.listingsCount !== 1 ? "s" : ""
          }`;
        }

        return {
          id: owner._id,
          name: owner.name || "Unknown Owner",
          email: owner.email,
          phone: owner.phone || "N/A",
          status: owner.isActive ? "Active" : "Suspended",
          listings: listingsText,
          createdAt: owner.createdAt,
          isVerified: owner.isVerified || false,
        };
      });

      // Generate detailed PDF
      exportDetailedOwnersToPDF(ownersForExport, filters, statistics);

      toast.dismiss(loadingToast);
      toast.success("Complete PDF report downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setExportLoading(false);
    }
  };

  const handleQuickExport = () => {
    if (ownersState.list.length === 0) {
      toast.warning("No owners data to export");
      return;
    }

    setExportDropdownOpen(false);

    const ownersForExport = formattedOwners.map((owner) => ({
      ...owner,
      isVerified: owner.isVerified || false,
    }));

    exportOwnersToPDF(ownersForExport, filters);
    toast.success("Quick PDF report downloaded!");
  };

  // Format owners data for the UserListing component - FIXED VERSION
  const formattedOwners = ownersState.list.map((owner) => {
    let listingsText = "No listings";

    if (owner.listings && owner.listings !== "") {
      listingsText = owner.listings;
    } else if (owner.listingsCount) {
      listingsText = `${owner.listingsCount} listing${
        owner.listingsCount !== 1 ? "s" : ""
      }`;
    }

    // Debug log to check the actual data structure
    //console.log("Owner data:", owner);

    return {
      id: owner._id || owner.id, // Use _id from backend, fallback to id
      name: owner.name || "Unknown Owner",
      contact: owner.email || owner.phone || "No contact info",
      email: owner.email,
      phone: owner.phone,
      listings: listingsText,
      status: owner.isActive ? "Active" : "Suspended", // This should now be correct
      statusColor: owner.isActive ? "bg-green-100" : "bg-red-100",
      role: owner.role,
      createdAt: owner.createdAt,
      lastLogin: owner.lastLogin,
      isVerified: owner.isVerified,
      isActive: owner.isActive // Include this for debugging
    };
  });

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  // Calculate statistics
  const totalOwners =
    pagination.totalOwners ||
    pagination.totalUsers ||
    ownersState.list.length ||
    0;
  const activeOwners = ownersState.list.filter(
    (owner) => owner.isActive === true
  ).length;
  const suspendedOwners = ownersState.list.filter(
    (owner) => owner.isActive === false
  ).length;

  // Check if any filters are active
  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className="flex flex-col max-w-7xl mx-auto flex-1 w-full p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Mess Owners Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all mess owner accounts
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              disabled={
                loading || formattedOwners.length === 0 || exportLoading
              }
              className="flex items-center gap-2 relative"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exportLoading ? "Generating..." : "Export PDF"}
              <ChevronDown className="w-4 h-4" />
            </Button>

            {/* Dropdown menu for export options */}
            {exportDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Export Options
                  </div>
                  <button
                    onClick={handleQuickExport}
                    disabled={formattedOwners.length === 0}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">Quick Export</div>
                      <div className="text-xs text-gray-500">
                        Current page only
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleFullExport}
                    disabled={formattedOwners.length === 0 || exportLoading}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-t"
                  >
                    <Download className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">Full Export</div>
                      <div className="text-xs text-gray-500">
                        All matching records
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => toast.info("Add Owner feature is coming soon!")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Owner
          </Button>
        </div>
      </div>

      {/* Export Info Banner */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Export Information
              </h4>
              <p className="text-sm text-blue-700">
                Export will include {totalOwners} owner
                {totalOwners !== 1 ? "s" : ""}
                {filters.search && ` matching "${filters.search}"`}
                {filters.status && ` with status: ${filters.status}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Owners
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalOwners}
                </p>
                {hasActiveFilters && (
                  <p className="text-xs text-gray-500 mt-1">
                    {pagination.totalOwners
                      ? `Filtered from ${pagination.totalOwners} total`
                      : "Filters applied"}
                  </p>
                )}
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Owners
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeOwners}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalOwners > 0
                    ? `${Math.round(
                        (activeOwners / totalOwners) * 100
                      )}% of total`
                    : "No owners"}
                </p>
              </div>
              <Badge variant="success" className="text-xs">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-red-600">
                  {suspendedOwners}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalOwners > 0
                    ? `${Math.round(
                        (suspendedOwners / totalOwners) * 100
                      )}% of total`
                    : "No owners"}
                </p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Suspended
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search Owners
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Active Filters Badge */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.search && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: "{filters.search}"
                  </Badge>
                )}
                {filters.status && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Status: {filters.status}
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={loading}
                >
                  Clear Filters
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Apply Filters"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
            <button
              onClick={clearErrorHandler}
              className="text-red-700 hover:text-red-900 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Owners Listing */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading owners...</span>
              </div>
            </div>
          ) : (
            <UserListing
              users={formattedOwners}
              user={"Owners"}
              pagination={pagination}
              onPageChange={handlePageChange}
              onDeleteUser={handleDeleteUser}
              onStatusChange={handleStatusChange}
              loading={actionLoading}
            />
          )}

          {/* Empty State */}
          {!loading && formattedOwners.length === 0 && (
            <div className="text-center p-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters
                  ? "No matching owners found"
                  : "No owners found"}
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search criteria or clear filters to see all owners."
                  : "There are no mess owners in the system yet."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Count Footer */}
      {!loading && formattedOwners.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
          <span>
            Showing {formattedOwners.length} of {totalOwners} owners
            {hasActiveFilters && " (filtered)"}
          </span>
          <span>
            Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
          </span>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MessOwners;
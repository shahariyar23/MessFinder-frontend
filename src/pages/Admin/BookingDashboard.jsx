
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Download,
  Filter,
  DollarSign,
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  Users,
  Home,
  TrendingUp,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast, ToastContainer } from "react-toastify";
import {
  getAllBookingsAdmin,
  selectAdminBookings,
  selectAdminBookingStatistics,
  selectAdminBookingPagination,
  selectAdminBookingsLoading,
  selectAdminBookingActionLoading,
  selectAdminBookingsError,
  setFilters,
  clearError
} from "@/store/admin/bookingSlice";


// Excel Export Utility - Booking Management Report
const exportBookingsToExcel = (bookings, statistics, filters = {}) => {
  import('xlsx').then((XLSX) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare the data for Excel
    const excelData = [
      // Title row
      ['Booking Management Report'],
      [],
      // Header info
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [`Total Bookings: ${bookings.length}`],
      [`Total Revenue: ৳${Number(statistics?.revenue?.totalRevenue || 0).toLocaleString()}`],
    ];

    // Add filters info if applied
    if (Object.keys(filters).length > 0) {
      let filterText = "Filters: ";
      if (filters.status) filterText += `Status: ${filters.status} `;
      if (filters.paymentStatus) filterText += `Payment: ${filters.paymentStatus} `;
      if (filters.search) filterText += `Search: "${filters.search}"`;
      excelData.push([filterText]);
    }

    excelData.push([]);

    // Table headers
    excelData.push([
      '#', 
      'Booking ID', 
      'Tenant', 
      'Owner', 
      'Mess', 
      'Amount', 
      'Status', 
      'Payment', 
      'Check-in', 
      'Created'
    ]);

    // Add booking data
    bookings.forEach((booking, index) => {
      const amount = booking.payAbleAmount || 0;
      const formattedAmount = `৳${Number(amount).toLocaleString()}`;
      
      excelData.push([
        index + 1,
        booking.transactionId || booking._id,
        booking.tenantName,
        booking.owner?.name || "N/A",
        booking.mess?.title || "N/A",
        formattedAmount,
        booking.bookingStatus,
        booking.paymentStatus,
        new Date(booking.checkInDate).toLocaleDateString('en-GB'),
        new Date(booking.createdAt).toLocaleDateString('en-GB')
      ]);
    });

    // Add summary section
    excelData.push([]);
    excelData.push(['Summary:']);
    excelData.push([`Total Revenue: ৳${Number(statistics?.revenue?.totalRevenue || 0).toLocaleString()}`]);
    excelData.push([`Total Bookings: ${Number(statistics?.totalBookings || bookings.length)}`]);
    
    const averageAmount =
      Number(statistics?.revenue?.totalRevenue || 0) /
      Number(statistics?.revenue?.totalBookings || bookings.length);
    excelData.push([`Average Amount: ৳${averageAmount.toFixed(2)}`]);
    excelData.push([`Confirmed Bookings: ${statistics?.statusCounts?.confirmed?.count || 0}`]);

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths for better readability
    const colWidths = [
      { wch: 5 },   // #
      { wch: 25 },  // Booking ID
      { wch: 20 },  // Tenant
      { wch: 20 },  // Owner
      { wch: 25 },  // Mess
      { wch: 15 },  // Amount
      { wch: 12 },  // Status
      { wch: 12 },  // Payment
      { wch: 12 },  // Check-in
      { wch: 12 }   // Created
    ];
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Booking Report');

    // Generate Excel file and download
    const fileName = `booking-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }).catch(error => {
    console.error('Error generating Excel file:', error);
    alert('Error generating Excel report');
  });
};

const BookingDashboard = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectAdminBookings);
  const statistics = useSelector(selectAdminBookingStatistics);
  const pagination = useSelector(selectAdminBookingPagination);
  const loading = useSelector(selectAdminBookingsLoading);
  const actionLoading = useSelector(selectAdminBookingActionLoading);
  const error = useSelector(selectAdminBookingsError);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setLocalFilters] = useState({
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: ""
  });
  const [exportLoading, setExportLoading] = useState(false);

  // Initialize data
  useEffect(() => {
    dispatch(getAllBookingsAdmin({ page: 1, limit: 10 })).then(res=>console.log(res));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const allFilters = {
      ...filters,
      search: searchTerm
    };
    dispatch(setFilters(allFilters));
    dispatch(getAllBookingsAdmin({ page: 1, limit: 10, filters: allFilters }));
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setLocalFilters(newFilters);
    
    const allFilters = {
      ...newFilters,
      search: searchTerm
    };
    dispatch(setFilters(allFilters));
    dispatch(getAllBookingsAdmin({ page: 1, limit: 10, filters: allFilters }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocalFilters({
      status: "",
      paymentStatus: "",
      startDate: "",
      endDate: ""
    });
    dispatch(setFilters({}));
    dispatch(getAllBookingsAdmin({ page: 1, limit: 10 }));
  };

  const handlePageChange = (page) => {
    const allFilters = {
      ...filters,
      search: searchTerm
    };
    dispatch(getAllBookingsAdmin({ page, limit: 10, filters: allFilters }));
  };

  const handleExport = async () => {
    if (bookings.length === 0) {
      toast.warning("No bookings data to export");
      return;
    }

    setExportLoading(true);
    try {
      // Get all bookings without pagination for export
      const allFilters = {
        ...filters,
        search: searchTerm,
        limit: "1000"
      };
      
      const result = await dispatch(getAllBookingsAdmin({ page: 1, limit: 1000, filters: allFilters })).unwrap();
      
      if (result.success) {
        const allBookings = result.data.bookings;
        exportBookingsToExcel(allBookings, result.data.statistics, allFilters);
        toast.success("PDF report downloaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate PDF report");
      console.error("Export error:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-purple-100 text-purple-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      paid: <CheckCircle className="w-4 h-4" />,
      failed: <XCircle className="w-4 h-4" />,
      refunded: <RefreshCw className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(value => value !== "");

  return (
    <div className="flex flex-col max-w-7xl mx-auto flex-1 w-full p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Booking Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all booking transactions and status
            </p>
          </div>
        </div>

        <Button
          onClick={handleExport}
          disabled={exportLoading || bookings.length === 0}
          className="flex items-center gap-2"
          variant="nav"
        >
          {exportLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exportLoading ? "Exporting..." : "Export Excl"}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(statistics.revenue?.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {statistics.revenue?.totalBookings} bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.totalBookings}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  All transactions
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(statistics.revenue?.averageAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Per booking
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-orange-600">
                  {bookings.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Showing
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      {Object.keys(statistics.statusCounts || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(statistics.statusCounts).map(([status, data]) => (
                <div key={status} className="flex items-center gap-2">
                  <Badge className={getStatusColor(status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(status)}
                      {status.toUpperCase()}
                    </span>
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {data.count} bookings ({formatCurrency(data.revenue)})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Status Distribution */}
      {Object.keys(statistics.paymentStatusCounts || {}).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(statistics.paymentStatusCounts).map(([status, data]) => (
                <div key={status} className="flex items-center gap-2">
                  <Badge className={getPaymentStatusColor(status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(status)}
                      {status.toUpperCase()}
                    </span>
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {data.count} payments ({formatCurrency(data.amount)})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search Bookings
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by tenant, owner, mess, transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Booking Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Booking Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Payment Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Payment Status
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Active Filters Badge */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {filters.status && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {filters.status}
                  </Badge>
                )}
                {filters.paymentStatus && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Payment: {filters.paymentStatus}
                  </Badge>
                )}
                {filters.startDate && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    From: {filters.startDate}
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
                >
                  Clear Filters
                </Button>
              )}
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Apply Filters
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

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading bookings...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">
                  Booking History ({bookings.length})
                </h3>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Mess</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Booking Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Check-in Date</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Calendar className="w-12 h-12 text-gray-300" />
                          <span className="text-gray-500">No bookings found</span>
                          {hasActiveFilters && (
                            <Button variant="outline" onClick={handleClearFilters}>
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-mono text-sm">
                          {booking.transactionId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.tenantName}</p>
                            <p className="text-sm text-gray-500">{booking.tenantEmail}</p>
                            <p className="text-sm text-gray-500">{booking.tenantPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.owner?.name}</p>
                            <p className="text-sm text-gray-500">{booking.owner?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.mess?.title}</p>
                            <p className="text-sm text-gray-500">{booking.mess?.address}</p>
                            <p className="text-sm text-gray-500">
                              ৳{booking.mess?.payPerMonth}/month
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(booking.payAbleAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.advanceMonths} month{booking.advanceMonths > 1 ? 's' : ''} advance
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.bookingStatus)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.bookingStatus)}
                              {booking.bookingStatus}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(booking.paymentStatus)}
                              {booking.paymentStatus}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(booking.checkInDate)}
                        </TableCell>
                        <TableCell>
                          {formatDate(booking.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => {
                              // Add view details functionality
                              toast.info(`Viewing details for ${booking.tenantName}'s booking`);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && bookings.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {bookings.length} of {pagination.totalBookings} bookings
            {hasActiveFilters && " (filtered)"}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            
            <span className="text-sm text-gray-600 px-4">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BookingDashboard;
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Payment = () => {
    const { userBookings } = useSelector(state => state.booking);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedBooking(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'refunded':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'paid':
                return 'Paid';
            case 'pending':
                return 'Pending';
            case 'failed':
                return 'Failed';
            case 'refunded':
                return 'Refunded';
            default:
                return status;
        }
    };

    const getBookingStatusColor = (status) => {
        switch (status) {
            case 'confirm':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700';
            case 'cancelled':
                return 'bg-red-50 text-red-700';
            case 'completed':
                return 'bg-blue-50 text-blue-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    if (!userBookings || userBookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border border-[#cfdfe7] rounded-lg bg-slate-50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-[#0d171b] font-bold text-lg mb-2">No Payment Records</p>
                <p className="text-gray-600 text-sm">No payment history available for this booking.</p>
            </div>
        );
    }

    return (
        <>
            <Table className="min-w-full border border-[#cfdfe7] rounded-lg bg-slate-50">
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium">
                            Booking Date
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium">
                            Check-in Date
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium">
                            Payable Amount
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium">
                            Payment Status
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium">
                            Booking Status
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left text-[#4c809a] text-sm font-medium">
                            Details
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userBookings.map((booking) => (
                        <TableRow key={booking._id || booking.id} className="border-t border-[#cfdfe7] hover:bg-slate-100 transition-colors">
                            <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">
                                {formatDate(booking.bookingDate || booking.createdAt)}
                            </TableCell>
                            <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">
                                {formatDate(booking.checkInDate)}
                            </TableCell>
                            <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm font-medium">
                                BDT {booking.payAbleAmount || booking.totalAmount || 0}
                            </TableCell>
                            <TableCell className="h-12 px-4 py-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(booking.paymentStatus)}`}>
                                    {getStatusText(booking.paymentStatus)}
                                </span>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-2">
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${getBookingStatusColor(booking.bookingStatus)}`}>
                                    {booking.bookingStatus}
                                </span>
                            </TableCell>
                            <TableCell 
                                className="h-12 px-4 py-2 cursor-pointer text-[#4c809a] font-bold hover:text-[#0d171b] transition-colors text-sm"
                                onClick={() => handleViewDetails(booking)}
                            >
                                View Details
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Payment Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md sm:max-w-lg max-h-[85vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-xl font-bold text-[#0d171b]">
                            Payment Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information about your booking payment
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && (
                        <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-2">
                            {/* Custom scrollbar styling */}
                            <style jsx>{`
                                .overflow-y-auto::-webkit-scrollbar {
                                    width: 6px;
                                }
                                .overflow-y-auto::-webkit-scrollbar-track {
                                    background: #f1f5f9;
                                    border-radius: 3px;
                                }
                                .overflow-y-auto::-webkit-scrollbar-thumb {
                                    background: #cbd5e1;
                                    border-radius: 3px;
                                }
                                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                                    background: #94a3b8;
                                }
                            `}</style>

                            {/* Payment Summary */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-[#cfdfe7]">
                                <h3 className="font-semibold text-[#0d171b] mb-3">Payment Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Booking ID:</span>
                                        <span className="font-medium text-xs">{selectedBooking._id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Booking Date:</span>
                                        <span>{formatDateTime(selectedBooking.bookingDate || selectedBooking.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Check-in Date:</span>
                                        <span>{formatDate(selectedBooking.checkInDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Booking Status:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getBookingStatusColor(selectedBooking.bookingStatus)}`}>
                                            {selectedBooking.bookingStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-[#cfdfe7]">
                                <h3 className="font-semibold text-[#0d171b] mb-3">Payment Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Total Amount:</span>
                                        <span className="font-medium">BDT {selectedBooking.totalAmount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Payable Amount:</span>
                                        <span className="font-medium">BDT {selectedBooking.payAbleAmount || selectedBooking.totalAmount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Advance Months:</span>
                                        <span>{selectedBooking.advanceMonths || 1} month(s)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Payment Status:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(selectedBooking.paymentStatus)}`}>
                                            {getStatusText(selectedBooking.paymentStatus)}
                                        </span>
                                    </div>
                                    {selectedBooking.paymentMethod && (
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Payment Method:</span>
                                            <span className="capitalize">{selectedBooking.paymentMethod.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                    {selectedBooking.transactionId && (
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Transaction ID:</span>
                                            <span className="font-mono text-xs">{selectedBooking.transactionId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tenant Information */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-[#cfdfe7]">
                                <h3 className="font-semibold text-[#0d171b] mb-3">Tenant Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Name:</span>
                                        <span>{selectedBooking.tenantName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Phone:</span>
                                        <span>{selectedBooking.tenantPhone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#4c809a]">Email:</span>
                                        <span>{selectedBooking.tenantEmail}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mess Information */}
                            {selectedBooking.mess_id && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-[#cfdfe7]">
                                    <h3 className="font-semibold text-[#0d171b] mb-3">Mess Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Mess Name:</span>
                                            <span>{selectedBooking.mess_id?.title || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Address:</span>
                                            <span className="text-right">{selectedBooking.mess_id?.address || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Monthly Rent:</span>
                                            <span>BDT {selectedBooking.mess_id?.payPerMonth || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Emergency Contact */}
                            {selectedBooking.emergencyContact && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-[#cfdfe7]">
                                    <h3 className="font-semibold text-[#0d171b] mb-3">Emergency Contact</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Name:</span>
                                            <span>{selectedBooking.emergencyContact.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Phone:</span>
                                            <span>{selectedBooking.emergencyContact.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#4c809a]">Relation:</span>
                                            <span>{selectedBooking.emergencyContact.relation}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Close Button - Fixed at bottom */}
                    <div className="flex-shrink-0 flex justify-end pt-4 border-t border-[#cfdfe7] mt-4">
                        <Button 
                            onClick={closeDialog}
                            className="bg-[#4c809a] hover:bg-[#3a677d] text-white"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Payment;
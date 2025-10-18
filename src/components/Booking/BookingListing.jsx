import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const BookingListing = ({ bookings, isPastBooking }) => {
  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Get payment status variant
  const getPaymentVariant = (status) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4 p-4">
      {bookings?.map((booking) => (
        <Card
          key={booking._id}
          className="w-full max-w-4xl mx-auto shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {booking.mess_id?.title || "Unknown Mess"}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {booking.mess_id?.address || "No address provided"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={getStatusVariant(booking.bookingStatus)}
                  className="text-xs"
                >
                  {booking.bookingStatus.toUpperCase()}
                </Badge>
                <Badge
                  variant={getPaymentVariant(booking.paymentStatus)}
                  className="text-xs"
                >
                  Payment: {booking.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Booking Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Booking Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in Date:</span>
                    <span className="font-medium">
                      {formatDate(booking.checkInDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Date:</span>
                    <span className="font-medium">
                      {formatDate(booking.bookingDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent:</span>
                    <span className="font-medium">
                      {formatCurrency(booking.mess_id?.payPerMonth)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advance Paid:</span>
                    <span className="font-medium">
                      {formatCurrency(booking.payAbleAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advance Months:</span>
                    <span className="font-medium">
                      {booking.advanceMonths} month(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {booking.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tenant & Contact Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Tenant Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{booking.tenantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{booking.tenantPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-blue-600">
                      {booking.tenantEmail}
                    </span>
                  </div>
                </div>

                {booking.emergencyContact && (
                  <>
                    <Separator />
                    <h4 className="font-medium text-gray-900 text-xs">
                      Emergency Contact
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                          {booking.emergencyContact.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {booking.emergencyContact.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relation:</span>
                        <span className="font-medium capitalize">
                          {booking.emergencyContact.relation}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Owner Information */}
            <Separator className="my-4" />
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">
                Owner Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-around">
                  <span className="text-gray-600">Owner Name:</span>
                  <span className="font-medium">
                    {booking.owner_id?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-around">
                  <span className="text-gray-600">Owner Phone:</span>
                  <span className="font-medium">
                    {booking.owner_id?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isPastBooking && (
              <>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-2 justify-end">
                  {booking.bookingStatus === "pending" && (
                    <>
                      <Button variant="destructive" size="sm">
                        Cancel Booking
                      </Button>
                      {booking?.paymentStatus !== "paid" && (
                        <Button variant="nav" size="sm">
                          Pay Now
                        </Button>
                      )}
                    </>
                  )}
                  {booking.bookingStatus === "confirmed" && (
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingListing;

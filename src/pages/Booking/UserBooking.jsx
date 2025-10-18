import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import BookingListing from "../../components/Booking/BookingListing";
import SaveMess from "@/components/Booking/SaveMess";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getUserBookings } from "@/store/mess/bookingSlice";

const UserBooking = () => {
  const [tabValue, setTabvalue] = useState("upcoming");
  const { 
    upcomingBookings, 
    pastBookings, 
    userBookingsLoading,
    bookingCounts 
  } = useSelector((state) => state.booking);
  
  console.log("up: ", upcomingBookings, "past", pastBookings);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all bookings initially without type filter to get counts
    dispatch(getUserBookings({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleTabChange = (value) => {
    setTabvalue(value);
    // Optionally fetch with type filter when tab changes
    // dispatch(getUserBookings({ type: value, page: 1, limit: 10 }));
  };

  // Loading skeleton for booking cards
  const BookingSkeleton = () => (
    <Card className="w-full max-w-[360px] sm:max-w-[480px]">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Loading skeleton for the image
  const ImageSkeleton = () => (
    <Skeleton className="aspect-video rounded-lg w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-[180px] sm:h-[200px] md:h-[220px]" />
  );

  return (
    <div className="mt-3">
      <Tabs 
        defaultValue="upcoming" 
        value={tabValue}
        onValueChange={handleTabChange}
        className="min-h-screen w-full"
      >
        <TabsList className="flex bg-transparent gap-2">
          <TabsTrigger
            key="upcoming"
            value="upcoming"
            className={`flex items-center justify-start gap-3 px-3 rounded-lg w-full transition
              ${tabValue === "upcoming" ? "text-sky-700" : "text-black shadow-sm"}
            `}
          >
            Upcoming {bookingCounts.upcoming > 0 && `(${bookingCounts.upcoming})`}
          </TabsTrigger>
          <TabsTrigger
            key="past"
            value="past"
            className={`flex items-center justify-start gap-3 px-3 rounded-lg w-full transition
              ${tabValue === "past" ? "text-sky-700" : "text-black shadow-sm"}
            `}
          >
            Past {bookingCounts.past > 0 && `(${bookingCounts.past})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="flex flex-wrap justify-between items-center gap-4 p-2 sm:p-4">
            <Skeleton className={`h-8 sm:h-12 min-w-32 sm:min-w-72 ${userBookingsLoading ? '' : 'hidden'}`} />
            <p className={`text-[#0d171b] font-bold min-w-32 sm:min-w-72 text-2xl sm:text-4xl ${userBookingsLoading ? 'hidden' : ''}`}>
              Bookings
            </p>
          </div>
          
          <Skeleton className={`h-8 w-32 mx-2 mb-4 ${userBookingsLoading ? '' : 'hidden'}`} />
          <h2 className={`text-[#0d171b] font-bold px-2 pb-2 pt-3 text-xl sm:text-2xl ${userBookingsLoading ? 'hidden' : ''}`}>
            Upcoming {bookingCounts.upcoming > 0 && `(${bookingCounts.upcoming})`}
          </h2>
          
          <div className="flex flex-col px-2 sm:px-4 py-6 items-center gap-6">
            {userBookingsLoading ? (
              // Loading state
              <>
                <ImageSkeleton />
                <div className="flex flex-col w-full max-w-[360px] sm:max-w-[480px] items-center gap-4 px-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </>
            ) : upcomingBookings && upcomingBookings.length > 0 ? (
              // Has upcoming bookings
              <div className="w-full">
                <BookingListing bookings={upcomingBookings} isPastBooking={false} />
              </div>
            ) : (
              // No upcoming bookings
              <>
                <div
                  className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-[180px] sm:h-[200px] md:h-[220px]"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZHoqdtXFCDtz0Vfxc-M-ad5BLwuGHcTFPB5PHgoMlhcK6SL172JoASmArFmJbsUrOYFRW2gTtrAgBqMxGPIj34cA-rdrefAwbOm78Fb7nP4-Qpiv7d4rTd3hGen-FcZxx6TSNBVqpJ2v-sYS3lKeZyLdDuAL9ROlvNSxXxTn2KNR_evBKmkjbui7F8WYrYJhRZtqiW_BSvKMbauWKMVw8KG-VwIuCRR-NfiJAmRv_Ilew64nlqeFGCNBzXA-hgKZM4ShxwQxEs70")',
                  }}
                />
                <div className="flex w-full max-w-[360px] sm:max-w-[480px] flex-col items-center gap-2 px-1">
                  <p className="text-[#0d171b] font-bold text-center text-base sm:text-lg">
                    No upcoming bookings
                  </p>
                  <p className="text-[#0d171b] text-sm font-normal text-center">
                    You don't have any upcoming bookings. Explore mess options and
                    book your preferred mess.
                  </p>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <Skeleton className={`h-8 w-40 mx-4 mb-4 ${userBookingsLoading ? '' : 'hidden'}`} />
          <h2 className={`text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 ${userBookingsLoading ? 'hidden' : ''}`}>
            Past Bookings {bookingCounts.past > 0 && `(${bookingCounts.past})`}
          </h2>
          
          {userBookingsLoading ? (
            // Loading state for past bookings
            <div className="px-4">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <BookingSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : pastBookings && pastBookings.length > 0 ? (
            <div className="px-4">
              <BookingListing bookings={pastBookings} isPastBooking={true} />
            </div>
          ) : (
            // No past bookings
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-[#0d171b] font-bold text-lg mb-2">No past bookings</p>
              <p className="text-gray-600 text-sm">You haven't made any past bookings yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserBooking;
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import BookingListing from "../../components/Booking/BookingListing";

const UserBooking = () => {
    const [tabValue, setTabvalue] = useState("upcoming");
    return <div className="mt-3">
        <Tabs
            defaultValue="upcoming"
            className="min-h-screen w-full"
        >
            <TabsList className="flex bg-transparent gap-2">
                <TabsTrigger key="upcoming"
                    value="upcoming"
                    onClick={() => setTabvalue("upcoming")}
                    className={`flex items-center justify-start gap-3 px-3 rounded-lg w-full transition
          ${tabValue === "upcoming" ? "text-sky-700" : "text-black shadow-sm"}
        `}
                >Upcoming</TabsTrigger>
                <TabsTrigger key="past"
                    value="past"
                    onClick={() => setTabvalue("past")}
                    className={`flex items-center justify-start gap-3 px-3 rounded-lg w-full transition
          ${tabValue === "past" ? "text-sky-700" : "text-black shadow-sm"}
        `}
                >Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                <div className="flex flex-wrap justify-between items-center gap-4 p-2 sm:p-4">
                    <p className="text-[#0d171b] font-bold min-w-32 sm:min-w-72 text-2xl sm:text-4xl">Bookings</p>
                </div>
                <h2 className="text-[#0d171b] font-bold px-2 pb-2 pt-3 text-xl sm:text-2xl">Upcoming</h2>
                <div className="flex flex-col px-2 sm:px-4 py-6 items-center gap-6">
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
                            You don't have any upcoming bookings. Explore mess options and book your preferred mess.
                        </p>
                    </div>
                </div>
                <div className="w-full px-1 sm:px-4">
                    <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Past</h2>
                    <BookingListing />
                </div>
            </TabsContent>

            <TabsContent value="past">
                <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Past</h2>
                <BookingListing />
            </TabsContent>
        </Tabs>
    </div>
}

export default UserBooking;
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import UserBooking from "@/pages/Booking/UserBooking";
import UserDashboard from "@/pages/Dashboard/UserDashoard";
import BookingListing from "@/components/Booking/BookingListing";
import Payment from "@/components/Booking/Payment";
import { sidebarLinks } from "@/config/config";
import { HelpCircle } from "lucide-react";



const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("booking");
    return (
        <div className="min-h-screen w-full bg-slate-50 ">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="booking"
                className="min-h-screen w-full"
            >
                <div className="flex flex-col lg:flex-row min-h-screen  w-full">
                    {/* Sidebar */}
                    <aside className="flex flex-col pt-20 lg:w-80 w-full border-r lg:min-h-[700px] bg-slate-50 p-4 gap-y-9 lg:gap-0 lg:justify-between">
                        <div>
                            <TabsList className="flex flex-col gap-2 w-full bg-transparent">
                                {sidebarLinks.map(link => {
                                    const Icon = activeTab === link.value && link.iconFilled ? link.iconFilled : link.icon;
                                    return (
                                        <TabsTrigger
                                            key={link.value}
                                            value={link.value}
                                            className={`flex items-center justify-start gap-3 px-3 rounded-lg cursor-pointer w-full transition
          ${activeTab === link.value ? "bg-[#d3e3ef] shadow-sm" : ""}
        `}
                                        >
                                            <Icon
                                                size={24}
                                                strokeWidth={activeTab === link.value ? 2.5 : 2}
                                                fill={activeTab === link.value ? "#0d171b" : "none"}
                                            />
                                            <span className="text-[#0d171b] text-sm font-medium leading-normal">{link.label}</span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>

                        </div>
                        {/* Help Static Item */}
                        <div className="mt-4 flex flex-col gap-1 cursor-pointer">
                            <div className="flex items-center gap-3 px-3 py-2">
                                <HelpCircle size={24} className="text-[#0d171b]" />
                                <span className="text-[#0d171b] text-sm font-medium leading-normal">Help</span>
                            </div>
                        </div>
                    </aside>
                    {/* Main Content */}
                    <main className="flex-1 max-w-[960px] mx-auto px-3 pt-3">
                        <TabsContent value="booking">
                            <UserBooking />
                        </TabsContent>
                        <TabsContent value="payments">
                            <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Saved</h2>
                            <Payment />
                        </TabsContent>
                        <TabsContent value="saved">
                            <h2 className="text-[#0d171b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Saved</h2>
                            <BookingListing />
                        </TabsContent>
                        <TabsContent value="profile">
                            <UserDashboard />
                        </TabsContent>
                    </main>
                </div>
            </Tabs>
        </div>
    );
};

export default UserProfile;

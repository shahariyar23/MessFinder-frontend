import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserBooking from "@/pages/Booking/UserBooking";
import UserDashboard from "@/pages/Dashboard/UserDashoard";
import Payment from "@/components/Booking/Payment";
import { sidebarLinks } from "@/config/config";
import Review from "../Review/Review"
import { HelpCircle, Menu, X, Home, Utensils, Info, Phone, Search, MessageSquare } from "lucide-react";
import Messlisting from "../Booking/MessListing";
import RequestView from "../Booking/RequestView";
import { useSelector } from "react-redux";
import SaveMess from "../Booking/SaveMess";
import { Link, useLocation } from "react-router";

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("booking");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const location = useLocation();
    const filteredSidebarLinks = sidebarLinks.filter(link => 
        !["list", "request"].includes(link.value)
    );
    
    const userSidebarLinks = (
        user?.role === "owner"
            ? [
                ...filteredSidebarLinks,
                { value: "list", label: "My Messes", icon: Utensils, iconFilled: Utensils }
              ]
            : filteredSidebarLinks
    );
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Create a combined list of all sidebar items including Help
    const allSidebarItems = [
        ...userSidebarLinks,
        { 
            value: "help", 
            label: "Help", 
            icon: HelpCircle,
            iconFilled: HelpCircle
        }
    ];
    
    return (
        <div className="min-h-screen w-full bg-white">

            <Tabs
                value={activeTab}
                onValueChange={(value) => {
                    setActiveTab(value);
                    setSidebarOpen(false);
                }}
                defaultValue="booking"
                className="w-full"
            >
                {/* Mobile Header (only shows when sidebar is closed) */}
                {!sidebarOpen && (
                    <div className="lg:hidden sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                        <div>
                            <h1 className="text-lg font-semibold text-[#0d171b] capitalize">
                                {activeTab === "booking" ? "Bookings" : 
                                 activeTab === "payments" ? "Payments" :
                                 activeTab === "saved" ? "Saved" :
                                 activeTab === "review" ? "Review" :
                                 activeTab === "profile" ? "Profile" :
                                 activeTab === "list" ? "My Messes" :
                                 activeTab === "help" ? "Help" : "Dashboard"}
                            </h1>
                            <p className="text-xs text-gray-500">User Dashboard</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            aria-label="Open dashboard menu"
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row w-full relative">
                    {/* User Profile Sidebar */}
                    <aside className={`
                        lg:sticky lg:top-0 lg:h-[100vh] lg:w-64 bg-white 
                        lg:border-r lg:pt-8 pt-4 lg:px-4 px-3
                        lg:translate-x-0 transition-transform duration-300 z-40
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        fixed lg:relative h-screen lg:h-auto overflow-y-auto
                        flex flex-col w-64
                    `}>
                        {/* Close button for mobile sidebar */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden absolute top-5 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                        
                        {/* App Title in Sidebar (mobile only) */}
                        <div className="lg:hidden px-4 mb-6 mt-2">
                            <h2 className="text-xl font-bold text-[#0d171b]">User Dashboard</h2>
                        </div>
                        
                        {/* User Info Section */}
                        <div className="px-4 mb-6 mt-10 lg:mb-8">
                            
                        </div>
                        
                        {/* Navigation Items Container */}
                        <div className="flex-grow">
                            <TabsList className="flex flex-col gap-1 w-full bg-transparent">
                                {allSidebarItems.map((link, index) => {
                                    const Icon = activeTab === link.value && link.iconFilled ? link.iconFilled : link.icon;
                                    const isHelp = link.value === "help";
                                    
                                    return (
                                        <TabsTrigger
                                            key={index}
                                            value={link.value}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center justify-start gap-3 px-4 py-3.5 lg:py-3 rounded-lg cursor-pointer w-full transition-all
                                                ${activeTab === link.value ? "bg-[#d3e3ef] text-[#0d171b] shadow-sm" : "text-gray-700 hover:bg-gray-50"}
                                                active:scale-[0.98]
                                                ${isHelp ? "mt-auto" : ""}
                                            `}
                                        >
                                            <Icon
                                                size={22}
                                                className="lg:size-5 flex-shrink-0"
                                                strokeWidth={activeTab === link.value ? 2.5 : 1.5}
                                                fill={activeTab === link.value ? "#0d171b" : "none"}
                                            />
                                            <span className="text-sm font-medium leading-normal">
                                                {link.label}
                                            </span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>
                    </aside>
                    
                    {/* Overlay for mobile sidebar */}
                    {sidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                    
                    {/* Main Content */}
                    <main className="flex-1 w-full px-4 lg:px-8 py-4 lg:py-6 max-w-6xl mx-auto lg:min-h-[100vh]">
                        <div className="min-h-[calc(100vh-180px)] lg:min-h-[calc(100vh-100px)]">
                            <TabsContent value="booking" className="mt-0 animate-fade-in">
                                <UserBooking />
                            </TabsContent>
                            
                            {user?.role === "owner" && (
                                <TabsContent value="list" className="mt-0 animate-fade-in">
                                    <Messlisting />
                                </TabsContent>
                            )}
                            
                            <TabsContent value="payments" className="mt-0 animate-fade-in">
                                <div className="mb-6">
                                    <h1 className="text-[#0d171b] text-2xl lg:text-3xl font-bold mb-2">Payments</h1>
                                    <p className="text-gray-600 text-sm lg:text-base">Manage your payment history and transactions</p>
                                </div>
                                <Payment />
                            </TabsContent>
                            
                            <TabsContent value="saved" className="mt-0 animate-fade-in">
                                <SaveMess />
                            </TabsContent>
                            
                            <TabsContent value="review" className="mt-0 animate-fade-in">
                                <Review />
                            </TabsContent>
                            
                            <TabsContent value="profile" className="mt-0 animate-fade-in">
                                <UserDashboard />
                            </TabsContent>
                            
                            <TabsContent value="help" className="mt-0 animate-fade-in">
                                <div className="p-4 lg:p-6 bg-white rounded-xl shadow-sm">
                                    <h1 className="text-[#0d171b] text-2xl lg:text-3xl font-bold mb-4">Help & Support</h1>
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-lg mb-2">Frequently Asked Questions</h3>
                                            <p className="text-gray-600">Find answers to common questions about booking, payments, and account management.</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-lg mb-2">Contact Support</h3>
                                            <p className="text-gray-600">Need help? Our support team is available 24/7 to assist you.</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </main>
                </div>
            </Tabs>
            
            {/* Add fade-in animation */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default UserProfile;

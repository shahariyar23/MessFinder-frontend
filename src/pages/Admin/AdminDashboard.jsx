import { useState } from "react";
import { LogIn } from "lucide-react";

import { adminLinks } from "@/config/config";
// import { A } from "react-router/dist/development/routeModules-BmVo7q9e";
import AdminDashboardInfo from "./AdminDashboardInfo";
import PaymentsHistory from "./PaymentHistory";
import MessListings from "./MessListings";
import MessOwners from "./MessOwners";
import MessUsers from "./MessUsers";
import PendingApprovals from "./PendingApprovals";





export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="flex flex-col lg:flex-row min-h-screen w-full">
        {/* Sidebar */}
        <aside className="flex flex-col pt-20 lg:w-80 w-full border-r lg:min-h-[700px] bg-slate-50 p-4 gap-y-9 lg:gap-0 lg:justify-between">
          <div>
            <nav className="flex flex-col gap-2 w-full bg-transparent">
              {adminLinks.map(link => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.value}
                    onClick={() => setActiveTab(link.value)}
                    className={`flex items-center justify-start gap-3 px-3 py-2 rounded-lg cursor-pointer w-full transition
                        ${activeTab === link.value ? "bg-[#d3e3ef] shadow-sm" : ""}
                    `}
                  >
                    <Icon
                      size={24}
                      strokeWidth={activeTab === link.value ? 2.5 : 2}
                      fill={activeTab === link.value ? "#0d171b" : "none"}
                    />
                    <span className="text-[#0d171b] text-sm font-medium leading-normal">{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <button
              className="flex items-cente cursor-pointer gap-3 px-3 py-2 rounded-lg bg-[#13a4ec] text-white font-medium text-sm transition hover:bg-[#0d81c3]"
              
            >
              <LogIn size={24} />
              SignOut
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-[960px] mx-auto px-3 pt-3">

          
          {activeTab === "dashboard" && (
            <>
              <AdminDashboardInfo />
            </>
          )}

          {/* You can add content for other admin tabs here, e.g.: */}
          {activeTab === "mess-listings" && (
            <MessListings/>
          )}
          {activeTab === "user-activity" && (
            <MessUsers/>
          )}
          {activeTab === "owner-activity" && (
            <MessOwners/>
          )}
          {activeTab === "payments" && (
            <PaymentsHistory/>
          )}
          {activeTab === "approvals" && (
            <PendingApprovals/>
          )}
        </main>
      </div>
    </div>
  );
}

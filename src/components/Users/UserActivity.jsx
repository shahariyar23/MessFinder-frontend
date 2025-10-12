import { Search, LogIn, LogOut, Eye, Star, Calendar } from "lucide-react";

const activityData = [
  {
    type: "login",
    icon: <LogIn size={24} className="text-[#0d171b]" />,
    label: "Logged In",
    desc: "2023-09-20 08:00 AM",
  },
  {
    type: "search",
    icon: <Search size={24} className="text-[#0d171b]" />,
    label: "Searched for 'Downtown Mess'",
    desc: "2023-09-20 09:15 AM",
  },
  {
    type: "eye",
    icon: <Eye size={24} className="text-[#0d171b]" />,
    label: "Viewed 'Cozy Student House'",
    desc: "2023-09-20 10:30 AM",
  },
  {
    type: "calendar",
    icon: <Calendar size={24} className="text-[#0d171b]" />,
    label: "Attempted Booking at 'Campus View Apartments'",
    desc: "2023-09-20 11:45 AM",
  },
  {
    type: "star",
    icon: <Star size={24} className="text-[#0d171b]" />,
    label: "Submitted Review for 'Suburb Shared Mess'",
    desc: "2023-09-20 13:00 PM",
  },
  {
    type: "logout",
    icon: <LogOut size={24} className="text-[#0d171b]" />,
    label: "Logged Out",
    desc: "2023-09-20 14:15 PM",
  },
  {
    type: "login",
    icon: <LogIn size={24} className="text-[#0d171b]" />,
    label: "Logged In",
    desc: "2023-09-21 09:00 AM",
  },
  {
    type: "search",
    icon: <Search size={24} className="text-[#0d171b]" />,
    label: "Searched for 'Uptown Accommodations'",
    desc: "2023-09-21 10:30 AM",
  },
  {
    type: "eye",
    icon: <Eye size={24} className="text-[#0d171b]" />,
    label: "Viewed 'Student Retreat'",
    desc: "2023-09-21 11:45 AM",
  },
  {
    type: "logout",
    icon: <LogOut size={24} className="text-[#0d171b]" />,
    label: "Logged Out",
    desc: "2023-09-21 13:00 PM",
  },
];

export default function UserActivity() {
  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">User Activity</p>
      </div>
      {/* Search */}
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full items-stretch rounded-lg h-full">
            <div className="flex items-center pl-4 bg-[#e7eff3] rounded-l-lg">
              <Search size={24} className="text-[#4c809a]" />
            </div>
            <input
              placeholder="Search user activity..."
              className="flex w-full min-w-0 flex-1 rounded-lg border-none bg-[#e7eff3] text-[#0d171b] placeholder:text-[#4c809a] px-4 h-full focus:outline-none rounded-l-none"
            />
          </div>
        </label>
      </div>
      {/* Filter */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">Filter Options</h2>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <select className="flex w-full min-w-0 rounded-lg text-[#0d171b] border border-[#cfdfe7] bg-slate-50 h-14 px-4 text-base font-normal focus:outline-none">
            <option value="">Select Activity Type</option>
            <option value="login">Login</option>
            <option value="search">Search</option>
            <option value="view">View</option>
            <option value="review">Review</option>
            <option value="logout">Logout</option>
          </select>
        </label>
      </div>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <select className="flex w-full min-w-0 rounded-lg text-[#0d171b] border border-[#cfdfe7] bg-slate-50 h-14 px-4 text-base font-normal focus:outline-none">
            <option value="">Select Date Range</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </label>
      </div>
      {/* Timeline Log */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">User Activity Log</h2>
      <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
        {activityData.map((event, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-1 pt-3">
              {idx !== 0 && <div className="w-[1.5px] bg-[#cfdfe7] h-2"></div>}
              <div>{event.icon}</div>
              {(idx !== activityData.length - 1) && <div className="w-[1.5px] bg-[#cfdfe7] h-2 grow"></div>}
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-[#0d171b] text-base font-medium">{event.label}</p>
              <p className="text-[#4c809a] text-base font-normal">{event.desc}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

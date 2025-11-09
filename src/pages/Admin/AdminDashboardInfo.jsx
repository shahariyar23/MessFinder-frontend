import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getUserStatistics } from '@/store/admin/usersSlice';
import { selectUserStatistics, selectUsersLoading } from '@/store/admin/usersSlice';

const AdminDashboardInfo = () => {
  const dispatch = useDispatch();
  const userStatistics = useSelector(selectUserStatistics);
  const loading = useSelector(selectUsersLoading);

  useEffect(() => {
    console.log("inside useeffect")
    dispatch(getUserStatistics());
  }, [dispatch]);

  console.log(userStatistics, "from admin")

  // Extract data from statistics
  const totalUsers = userStatistics?.users?.overall?.totalUsers || 0;
  const totalActive = userStatistics?.users?.overall?.totalActive || 0;
  const ownerStats = userStatistics?.users?.byRole?.owner || { count: 0, activeUsers: 0 };
  const studentStats = userStatistics?.users?.byRole?.student || { count: 0, activeUsers: 0 };
  const adminStats = userStatistics?.users?.byRole?.admin || { count: 0, activeUsers: 0 };
  
  // Mess listing data
  const totalMessListings = userStatistics?.messListings?.overall?.totalListings || 0;
  const totalViews = userStatistics?.messListings?.overall?.totalViews || 0;
  const avgPrice = userStatistics?.messListings?.overall?.avgPrice || 0;
  
  // Status breakdown
  const activeListings = userStatistics?.messListings?.byStatus?.free || 0;
  const bookedListings = userStatistics?.messListings?.byStatus?.booked || 0;
  const pendingListings = userStatistics?.messListings?.byStatus?.pending || 0;
  
  // Location data
  const locationData = userStatistics?.messListings?.byLocation || [];
  const recentActivities = userStatistics?.recentActivities || [];

  // Calculate percentages for location chart
  const locationDataWithPercentage = locationData.map(location => ({
    ...location,
    percentage: totalMessListings > 0 ? Math.round((location.count / totalMessListings) * 100) : 0
  }));

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-44 mb-6"></div>
          <div className="flex flex-wrap gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 min-w-[158px] h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] text-[32px] font-bold min-w-44 tracking-tight">Dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 p-4">
        {/* Total Mess Listings */}
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7eff3]">
          <p className="text-[#0d171b] text-base font-medium">Total Mess Listings</p>
          <p className="text-[#0d171b] text-2xl font-bold">{totalMessListings}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              Active: {activeListings}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Booked: {bookedListings}
            </Badge>
          </div>
        </div>
        
        {/* Active Users */}
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7eff3]">
          <p className="text-[#0d171b] text-base font-medium">Active Users</p>
          <p className="text-[#0d171b] text-2xl font-bold">{totalActive}</p>
          <div className="flex gap-1">
            <p className="text-[#4c809a] text-sm">Total: {totalUsers}</p>
            <p className="text-[#078836] text-sm font-medium">
              {totalUsers > 0 ? `${Math.round((totalActive / totalUsers) * 100)}%` : '0%'}
            </p>
          </div>
        </div>
        
        {/* Students */}
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7eff3]">
          <div>
            <p className="text-[#0d171b] text-base font-medium">Students</p>
            <p className="text-[#0d171b] text-2xl font-bold">{studentStats.count || 0}</p>
            <div className="flex gap-1">
              <p className="text-[#4c809a] text-sm">Active: {studentStats.activeUsers || 0}</p>
            </div>
          </div>
        </div>
        
        {/* Mess Owners */}
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7eff3]">
          <div>
            <p className="text-[#0d171b] text-base font-medium">Mess Owners</p>
            <p className="text-[#0d171b] text-2xl font-bold">{ownerStats.count || 0}</p>
            <div className="flex gap-1">
              <p className="text-[#4c809a] text-sm">Active: {ownerStats.activeUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <h2 className="text-[#0d171b] text-[22px] font-bold px-4 pb-3 pt-5">Recent Activity</h2>
      <div className="px-2 sm:px-4 py-3 overflow-x-auto">
        <Table className="min-w-full border border-[#cfdfe7] rounded-lg bg-slate-50">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-[#0d171b] w-32 sm:w-52">User</TableHead>
              <TableHead className="px-4 py-3 text-left text-[#0d171b] w-32 sm:w-52">Action</TableHead>
              <TableHead className="px-4 py-3 text-left text-[#0d171b] w-32 sm:w-52">Mess Title</TableHead>
              <TableHead className="px-4 py-3 text-left text-[#0d171b] w-32 sm:w-52">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <TableRow key={index} className="border-t border-[#cfdfe7]">
                  <TableCell className="h-12 px-4 py-2 text-[#0d171b] text-sm">{activity.user}</TableCell>
                  <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">{activity.action}</TableCell>
                  <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">{activity.title}</TableCell>
                  <TableCell className="h-12 px-4 py-2 text-[#4c809a] text-sm">
                    {new Date(activity.time).toLocaleDateString()} {new Date(activity.time).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-12 px-4 py-2 text-center text-gray-500">
                  No recent activity
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mess Listings Overview */}
      <h2 className="text-[#0d171b] text-[22px] font-bold px-4 pb-3 pt-5">Mess Listings Overview</h2>
      <div className="flex flex-wrap gap-4 px-2 sm:px-4 py-4">
        {/* Location Distribution */}
        <div className="flex flex-1 flex-col gap-2 min-w-[220px] rounded-lg border border-[#cfdfe7] p-6">
          <p className="text-[#0d171b] text-base font-medium">Mess Listings by Location</p>
          <p className="text-[#0d171b] text-2xl font-bold truncate">{totalMessListings}</p>
          <div className="flex gap-1">
            <p className="text-[#4c809a] text-base font-normal">Total Listings</p>
            <p className="text-[#078836] text-base font-medium">
              {totalMessListings > 0 ? '+0%' : '0%'}
            </p>
          </div>
          <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-2 items-center py-3">
            {locationDataWithPercentage.length > 0 ? (
              locationDataWithPercentage.map((item, index) => (
                <div key={index} className="contents">
                  <p className="text-[#4c809a] text-[13px] font-bold truncate">{item._id}</p>
                  <div className="h-4 flex items-center">
                    <div 
                      className="bg-[#e7eff3] border-[#4c809a] border-r-2 h-full" 
                      style={{ width: `${item.percentage}%` }} 
                    />
                    <span className="text-xs ml-2 text-gray-600">{item.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-8">
                No location data available
              </div>
            )}
          </div>
        </div>
        
        {/* Additional Stats Card */}
        <div className="flex flex-1 flex-col gap-2 min-w-[220px] rounded-lg border border-[#cfdfe7] p-6">
          <p className="text-[#0d171b] text-base font-medium">Listing Statistics</p>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4c809a]">Total Views</span>
              <span className="text-sm font-bold text-[#0d171b]">
                {totalViews.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4c809a]">Average Price</span>
              <span className="text-sm font-bold text-[#0d171b]">
                ৳{Math.round(avgPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4c809a]">Active Listings</span>
              <Badge variant="success" className="text-xs">
                {activeListings}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4c809a]">Booked Listings</span>
              <Badge variant="secondary" className="text-xs">
                {bookedListings}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardInfo;
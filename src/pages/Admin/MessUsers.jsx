import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserListing from "@/components/Users/UserListing";
import { 
  deleteUser, 
  getAllStudents, 
  setFilters, 
  clearError,
  modifyUser,
  selectStudents,
  selectUsersLoading,
  selectUsersError,
  selectStudentPagination,
  selectFilters
} from "@/store/admin/usersSlice";

const MessUsers = () => {
  const dispatch = useDispatch();
  const studentsState = useSelector(selectStudents);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectStudentPagination);
  const filters = useSelector(selectFilters);
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllStudents({ 
      page: 1, 
      limit: 10, 
      search: filters.search 
    }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(getAllStudents({ 
      page: 1, 
      limit: 10, 
      search: searchTerm 
    }));
  };

  const handlePageChange = (page) => {
    dispatch(getAllStudents({ 
      page, 
      limit: 10, 
      search: filters.search 
    }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId)).then(() => {
        dispatch(getAllStudents({ 
          page: pagination.currentPage, 
          limit: 10, 
          search: filters.search 
        }));
      });
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    dispatch(modifyUser({ 
      userId, 
      userData: { isActive: newStatus === "Active" } 
    })).then(() => {
      dispatch(getAllStudents({ 
        page: pagination.currentPage, 
        limit: 10, 
        search: filters.search 
      }));
    });
  };

  // Format students data for the UserListing component
  const formattedUsers = (studentsState?.list || []).map(student => ({
    id: student._id,
    name: student.name || "Unknown",
    contact: student.email || student.phone || "No contact info",
    listings: student.listingsCount || 0, // This might be 0 for students
    status: student.isActive ? "Active" : "Suspended",
    statusColor: student.isActive ? "bg-[#e7eff3]" : "bg-red-100",
    action: "View Profile",
    email: student.email,
    phone: student.phone,
    role: student.role,
    createdAt: student.createdAt
  }));

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">
          Students
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={clearErrorHandler}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading students...</span>
        </div>
      )}

      {/* Users Listing */}
      {!loading && (
        <UserListing 
          users={formattedUsers}
          user={"Students"}
          pagination={pagination}
          onPageChange={handlePageChange}
          onDeleteUser={handleDeleteUser}
          onStatusChange={handleStatusChange}
          loading={loading}
        />
      )}

      {/* Empty State */}
      {!loading && formattedUsers.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No students found. {filters.search && "Try adjusting your search criteria."}
        </div>
      )}
    </div>
  );
};

export default MessUsers;
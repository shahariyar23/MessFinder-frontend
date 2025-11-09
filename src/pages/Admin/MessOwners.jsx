import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserListing from "@/components/Users/UserListing";
import { 
  setFilters, 
  clearError,
  selectOwners,
  selectUsersLoading,
  selectUsersError,
  selectOwnerPagination,
  selectFilters,
  getAllOwners,
  deleteOwner,
  modifyOwner
} from "@/store/admin/usersSlice";

const MessUsers = () => {
  const dispatch = useDispatch();
  const ownerState = useSelector(selectOwners);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectOwnerPagination);
  const filters = useSelector(selectFilters);
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllOwners({ 
      page: 1, 
      limit: 10, 
      search: filters.search 
    }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    dispatch(getAllOwners({ 
      page: 1, 
      limit: 10, 
      search: searchTerm 
    }));
  };

  const handlePageChange = (page) => {
    dispatch(getAllOwners({ 
      page, 
      limit: 10, 
      search: filters.search 
    }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteOwner(userId)).then(() => {
        dispatch(getAllOwners({ 
          page: pagination.currentPage, 
          limit: 10, 
          search: filters.search 
        }));
      });
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    dispatch(modifyOwner({ 
      userId, 
      userData: { isActive: newStatus === "Active" } 
    })).then(() => {
      dispatch(getAllOwners({ 
        page: pagination.currentPage, 
        limit: 10, 
        search: filters.search 
      }));
    });
  };

  const formattedUsers = (ownerState?.list || []).map(owner => ({
    id: owner._id,
    name: owner.name || "Unknown",
    contact: owner.email || owner.phone || "No contact info",
    listings: owner.listingsCount || 0,
    status: owner.isActive ? "Active" : "Suspended",
    statusColor: owner.isActive ? "bg-[#e7eff3]" : "bg-red-100",
    action: "View Profile",
    email: owner.email,
    phone: owner.phone,
    role: owner.role,
    createdAt: owner.createdAt
  }));

  const clearErrorHandler = () => {
    dispatch(clearError());
  };

  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">
          Mess Owners
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
          <span className="ml-2">Loading owners...</span>
        </div>
      )}

      {/* Users Listing */}
      {!loading && (
        <UserListing 
          users={formattedUsers}
          user={"owners"}
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
          No owners found. {filters.search && "Try adjusting your search criteria."}
        </div>
      )}
    </div>
  );
};

export default MessUsers;
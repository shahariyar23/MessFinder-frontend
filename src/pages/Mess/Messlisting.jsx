import Location from "@/components/Common/Location";
import Search from "@/components/Common/Seach";
import SortByOrder from "@/components/Common/SortByOrder";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { advancedSearchMesses, getAllMesses } from "@/store/mess/messSlice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

const Messlisting = () => {
  const { user } = useSelector((state) => state.auth);
  const { messes, isLoading, pagination } = useSelector((state) => state.mess);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selected, setSelected] = useState("Date");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  
  const sortOptions = ["Price", "Date", "Rating"];

  // Map sort options to backend values
  const getSortByValue = (selectedOption) => {
    switch (selectedOption) {
      case 'Price': return 'price';
      case 'Date': return 'date';
      case 'Rating': return 'rating';
      default: return 'price';
    }
  };

  // Debounced search function
  const performSearch = useCallback((searchValue, locationValue, sortValue, page = 1) => {
    const filters = {
      search: searchValue,
      location: locationValue,
      sortBy: getSortByValue(sortValue),
      sortOrder: 'desc',
      page: page,
      limit: 12
    };
    dispatch(advancedSearchMesses(filters));
  }, [dispatch]);

  // Handle search input change with debouncing
  const handleSearchChange = (value) => {
    setSearch(value);
    performSearch(value, location, selected, 1);
  };

  // Handle location input change with debouncing
  const handleLocationChange = (value) => {
    setLocation(value);
    performSearch(search, value, selected, 1);
  };

  // Handle search form submission
  const handleSearchSubmit = (query) => {
    setSearch(query);
    performSearch(query, location, selected, 1);
  };

  // Handle sort change
  const handleSortChange = (selectedOption) => {
    setSelected(selectedOption);
    performSearch(search, location, selectedOption, 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    performSearch(search, location, selected, newPage);
  };

  // Load initial data - all messes
  useEffect(() => {
    performSearch('', '', 'Date', 1);
  }, [performSearch]);

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">

        {/* Search Section */}
        <div className="px-4 py-3 space-y-4">
          <Search 
            value={search} 
            onChange={handleSearchChange} 
            onSubmit={handleSearchSubmit} 
          />
          
          {/* Location Search */}
          <div>
            <Location 
              value={location} 
              onChange={handleLocationChange} 
              onSubmit={handleSearchSubmit} 
              placeholder="Search by location..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Search Summary */}
        {(search || location) && (
          <div className="mx-4 mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              Showing results for: 
              {search && ` Name: "${search}"`}
              {search && location && ' and '}
              {location && ` Location: "${location}"`}
              {` | Sorted by: ${selected}`}
            </p>
            {/* Clear filters button */}
            {(search || location) && (
              <button
                onClick={() => {
                  setSearch('');
                  setLocation('');
                  performSearch('', '', selected, 1);
                }}
                className="mt-2 text-blue-600 text-sm hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="px-4 pb-2 text-gray-600">
            {search || location ? (
              <>Found {pagination?.totalMesses || 0} matching messes</>
            ) : (
              <>Showing all {pagination?.totalMesses || 0} messes</>
            )}
            {pagination?.totalPages > 1 && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
          </div>
        )}

        {/* Sort By */}
        <h3 className="text-[#0d171b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Sort By
        </h3>
        <div className="flex gap-3 p-3 flex-wrap pr-4">
          <SortByOrder
            sortOptions={sortOptions}
            selected={selected}
            setSelected={handleSortChange}
          />
        </div>

        {/* Mess Listing Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-4">
          {isLoading ? (
            <div className="col-span-full h-28 w-full flex items-center justify-center">
              <Spinner className="size-10 text-sky-500" />
            </div>
          ) : messes.length > 0 ? (
            messes.map((mess) => (
              <div 
                onClick={() => navigate(`/mess/info/${mess._id}`)} 
                key={mess?._id} 
                className="flex flex-col gap-3 pb-3 cursor-pointer border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={mess.image?.[0]?.url || "/default-mess.jpg"}
                    alt={mess.title}
                    onError={(e) => {
                      e.target.src = "/default-mess.jpg";
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[#0d171b] text-base font-medium leading-normal line-clamp-1">
                      {mess.title}
                    </p>
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sky-500 text-sm font-medium">
                        {mess.ratingInfo?.averageRating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({mess.ratingInfo?.totalReviews || 0})
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-[#4c809a] text-sm font-normal leading-normal line-clamp-2 mb-3">
                    {mess.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-black text-sm font-normal">
                        Monthly: <span className="text-sky-500 font-bold">৳ {mess.payPerMonth}</span>
                      </p>
                      <p className="text-black text-sm font-normal capitalize">
                        {mess.roomType}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-black text-sm font-normal">
                        Available: <span className="text-sky-500 font-bold">
                          {mess.availableFrom ? new Date(mess.availableFrom).toLocaleDateString() : 'N/A'}
                        </span>
                      </p>
                      <p className="text-black text-sm font-normal capitalize">
                        {mess.genderPreference}
                      </p>
                    </div>
                  </div>

                  {/* Facilities */}
                  {mess.facilities && mess.facilities.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {mess.facilities.slice(0, 3).map((facility, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {facility}
                          </span>
                        ))}
                        {mess.facilities.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{mess.facilities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                {search || location ? "No messes found matching your criteria" : "No messes available"}
              </div>
              <p className="text-gray-400">
                {search || location ? "Try adjusting your search criteria" : "Check back later for new mess listings"}
              </p>
              {(search || location) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setLocation('');
                    performSearch('', '', selected, 1);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Show all messes
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4 p-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span className="text-gray-600 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messlisting;
import Location from "@/components/Common/Location";
import Search from "@/components/Common/Seach";
import SortByOrder from "@/components/Common/SortByOrder";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { advancedSearchMesses, getAllMesses } from "@/store/mess/messSlice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Star, MapPin } from "lucide-react";

const Messlisting = () => {
  const { user } = useSelector((state) => state.auth);
  const { messes, isMessLoading, pagination } = useSelector((state) => state.mess);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState("Date");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const sortOptions = ["Price", "Date", "Rating"];

  // Map sort options to backend values
  const getSortByValue = (selectedOption) => {
    switch (selectedOption) {
      case "Price":
        return "price";
      case "Date":
        return "date";
      case "Rating":
        return "rating";
      default:
        return "price";
    }
  };

  // Debounced search function
  const performSearch = useCallback(
    (searchValue, locationValue, sortValue, page = 1) => {
      const filters = {
        search: searchValue,
        location: locationValue,
        sortBy: getSortByValue(sortValue),
        sortOrder: "desc",
        page: page,
        limit: 12,
      };
      dispatch(advancedSearchMesses(filters));
    },
    [dispatch]
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearch(value);
    performSearch(value, location, selected, 1);
  };

  // Handle location input change
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
    performSearch("", "", "Date", 1);
  }, [performSearch]);

  // Format price
  const formatPrice = (price) => {
    return `৳${price}/month`;
  };

  // Calculate rating
  const calculateRating = (ratingInfo) => {
    if (ratingInfo?.ownerWideStats?.averageRating) {
      return ratingInfo.ownerWideStats.averageRating.toFixed(1);
    }
    return "0.0";
  };

  // Calculate total reviews
  const calculateTotalReviews = (ratingInfo) => {
    if (ratingInfo?.ownerWideStats?.totalReviews) {
      return ratingInfo.ownerWideStats.totalReviews;
    }
    return 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Search
                value={search}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                placeholder="Search for messes..."
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Location
                value={location}
                onChange={handleLocationChange}
                onSubmit={handleSearchSubmit}
                placeholder="Search by location..."
                className="w-full"
              />
            </div>
          </div>

          {/* Search Summary */}
          {(search || location) && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-blue-800 text-sm">
                  Showing results for:
                  {search && <span className="font-medium"> "{search}"</span>}
                  {search && location && <span className="mx-1">and</span>}
                  {location && (
                    <span className="font-medium"> "{location}"</span>
                  )}
                  <span className="ml-2 text-gray-600">
                    • Sorted by: {selected}
                  </span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    performSearch("", "", selected, 1);
                  }}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {search || location ? "Search Results" : "All Messes"}
            </h1>
            {!isMessLoading && ( // FIXED: Changed from isLoading to isMessLoading
              <p className="text-gray-600 mt-1">
                {search || location ? (
                  <>Found {pagination?.totalMesses || 0} matching messes</>
                ) : (
                  <>Showing all {pagination?.totalMesses || 0} messes</>
                )}
                {pagination?.totalPages > 1 && (
                  <span className="text-gray-500">
                    {" "}
                    • Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <SortByOrder
              sortOptions={sortOptions}
              selected={selected}
              setSelected={handleSortChange}
            />
          </div>
        </div>

        {/* Mess Listing Grid */}
        {isMessLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-10 w-10 text-primary" />
            <span className="ml-3 text-gray-600">Loading messes...</span>
          </div>
        ) : messes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messes.map((mess) => (
              <Card
                key={mess._id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                onClick={() => navigate(`/mess/info/${mess._id}`)}
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={mess.image?.[0]?.url || "/default-mess.jpg"}
                    alt={mess.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/default-mess.jpg";
                    }}
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-black hover:bg-white"
                  >
                    {formatPrice(mess.payPerMonth)}
                  </Badge>
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">
                        {mess.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="line-clamp-1">{mess.address}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
                    {mess.description}
                  </p>

                  {/* Mess Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Room Type</p>
                      <p className="font-medium capitalize">
                        {mess.roomType || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="font-medium capitalize">
                        {mess.genderPreference || "Any"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Available From</p>
                      <p className="font-medium">
                        {mess.availableFrom
                          ? new Date(mess.availableFrom).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Facilities */}
                  {mess.facilities && mess.facilities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Facilities</p>
                      <div className="flex flex-wrap gap-1">
                        {mess.facilities.slice(0, 3).map((facility, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            {facility}
                          </Badge>
                        ))}
                        {mess.facilities.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-50 text-gray-500"
                          >
                            +{mess.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                {search || location
                  ? "No messes found"
                  : "No messes available"}
              </h3>
              <p className="text-gray-500 mb-6">
                {search || location
                  ? "Try adjusting your search criteria"
                  : "Check back later for new mess listings"}
              </p>
              {(search || location) && (
                <Button
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    performSearch("", "", selected, 1);
                  }}
                  variant="outline"
                >
                  Show all messes
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination?.totalPages > 1 && !isMessLoading && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="min-w-[100px]"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="min-w-[100px]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messlisting;
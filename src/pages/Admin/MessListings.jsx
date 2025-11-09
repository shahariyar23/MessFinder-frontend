import { useEffect, useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MoreHorizontal, Eye, Edit, Trash2, Filter } from "lucide-react";
import { 
  getAllMesses, 
  advancedSearchMesses, 
  updateFilters, 
  clearFilters,
  setCurrentPage 
} from '@/store/mess/messSlice';

export default function MessListings() {
  const dispatch = useDispatch();
  
  const messes = useSelector((state) => state.mess.messes);
  const pagination = useSelector((state) => state.mess.pagination);
  const filters = useSelector((state) => state.mess.filters);
  const isLoading = useSelector((state) => state.mess.isLoading);
  const isSearchLoading = useSelector((state) => state.mess.isSearchLoading);
  
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch messes when filters change
  useEffect(() => {
    const searchParams = {
      ...filters,
      search: debouncedSearch,
      page: filters.page || 1,
      limit: filters.limit || 10
    };
    
    if (debouncedSearch || filters.location || filters.roomType || filters.gender) {
      dispatch(advancedSearchMesses(searchParams));
    } else {
      dispatch(getAllMesses(searchParams));
    }
  }, [debouncedSearch, filters.location, filters.roomType, filters.gender, filters.page, dispatch]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
    dispatch(updateFilters({ search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(updateFilters({ [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    dispatch(clearFilters());
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'free':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price) => {
    return `৳${price?.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-44 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="flex gap-4 mb-6">
            <div className="h-14 bg-gray-200 rounded flex-1"></div>
            <div className="h-14 bg-gray-200 rounded flex-1"></div>
            <div className="h-14 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-[960px] mx-auto flex-1 w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-[#0d171b] font-bold text-2xl sm:text-4xl min-w-32">
          Mess Listings
          {pagination.totalMesses > 0 && (
            <span className="text-lg text-gray-500 ml-2">
              ({pagination.totalMesses})
            </span>
          )}
        </p>
        
        <Button 
          onClick={handleClearFilters}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Clear Filters
        </Button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search mess listings by title, description, or location..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 bg-[#e7eff3] border-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Filter Options */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
        Filter Options
      </h2>
      
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        {/* Location Filter */}
        <div className="flex flex-col min-w-40 flex-1">
          <Select
            value={filters.location || 'all'}
            onValueChange={(value) => handleFilterChange('location', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="h-14 bg-slate-50 border-[#cfdfe7]">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="uttara">Uttara</SelectItem>
              <SelectItem value="bashundhara">Bashundhara</SelectItem>
              <SelectItem value="mirpur">Mirpur</SelectItem>
              <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
              <SelectItem value="gulshan">Gulshan</SelectItem>
              <SelectItem value="banani">Banani</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Room Type Filter */}
        <div className="flex flex-col min-w-40 flex-1">
          <Select
            value={filters.roomType || 'all'}
            onValueChange={(value) => handleFilterChange('roomType', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="h-14 bg-slate-50 border-[#cfdfe7]">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="double">Double</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender Preference Filter */}
        <div className="flex flex-col min-w-40 flex-1">
          <Select
            value={filters.gender || 'all'}
            onValueChange={(value) => handleFilterChange('gender', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="h-14 bg-slate-50 border-[#cfdfe7]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-600">
          Showing {messes.length} of {pagination.totalMesses} mess listings
          {isSearchLoading && ' (Searching...)'}
        </p>
      </div>

      {/* Mess Listings Table */}
      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
        Mess Listings Overview
      </h2>
      
      <div className="px-4 py-3">
        <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[200px]">
                  Listing Name
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[150px]">
                  Location
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[120px]">
                  Price
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[100px]">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[150px]">
                  Owner
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[120px]">
                  Created
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[80px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messes.length > 0 ? (
                messes.map((mess) => (
                  <TableRow key={mess._id} className="border-t border-[#cfdfe7] hover:bg-gray-50">
                    <TableCell className="px-4 py-3">
                      <div>
                        <p className="text-[#0d171b] text-sm font-medium">{mess.title}</p>
                        <p className="text-[#4c809a] text-xs truncate max-w-[180px]">
                          {mess.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[#4c809a] text-sm">
                      {mess.address}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[#0d171b] text-sm font-medium">
                      {formatPrice(mess.payPerMonth)}
                      <span className="text-gray-500 text-xs block">per month</span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(mess.status)} border text-xs font-medium`}
                      >
                        {mess.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[#4c809a] text-sm">
                      {mess.owner_name || mess.owner_id?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[#4c809a] text-sm">
                      {formatDate(mess.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    {isSearchLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
                        <span className="ml-2">Loading mess listings...</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium mb-2">No mess listings found</p>
                        <p className="text-sm">Try adjusting your search filters or check back later.</p>
                        <Button 
                          onClick={handleClearFilters}
                          variant="outline" 
                          className="mt-3"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-4 border-t">
          <div className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev || isSearchLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || isSearchLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
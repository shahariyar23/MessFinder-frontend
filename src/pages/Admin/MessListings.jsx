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
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Filter,
  X,
  
} from "lucide-react";
import { 
  advancedSearchMesses, 
  updateFilters, 
  clearFilters,
  setCurrentPage,
  getMessById
} from '@/store/mess/messSlice';
import { 
  deleteMess, 
  getAllMesses, // ✅ Import from admin slice
  updateMess,
} from '@/store/admin/adminMessSlice';
import { ViewModal } from './ViewModal';
import { toast } from 'react-toastify';
import { DeleteModal } from './MessDelete';

const EditModal = ({ mess, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mess) {
      setFormData({
        title: mess.title || '',
        description: mess.description || '',
        address: mess.address || '',
        payPerMonth: mess.payPerMonth || '',
        status: mess.status || 'free',
        roomType: mess.roomType || 'Shared',
        genderPreference: mess.genderPreference || 'Male',
        contact: mess.contact || '',
        availableFrom: mess.availableFrom ? mess.availableFrom.split('T')[0] : '',
        advancePaymentMonth: mess.advancePaymentMonth || 1,
        facilities: Array.isArray(mess.facilities) ? mess.facilities : [],
        roomFeatures: Array.isArray(mess.roomFeatures) ? mess.roomFeatures : []
      });
    }
  }, [mess]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const processedData = {
        ...formData,
        title: formData.title || 'Untitled Mess',
        payPerMonth: Number(formData.payPerMonth) || 0,
        advancePaymentMonth: Number(formData.advancePaymentMonth) || 1,
        status: formData.status || 'free',
        roomType: formData.roomType || 'Shared',
        genderPreference: formData.genderPreference || 'Male',
        facilities: Array.isArray(formData.facilities) ? formData.facilities : [],
        roomFeatures: Array.isArray(formData.roomFeatures) ? formData.roomFeatures : [],
      };

      const updateData = { updateData: processedData };
      
      console.log('Sending update data:', updateData);
      
      await onSave(mess._id, updateData);
      onClose();
    } catch (error) {
      console.error('Error updating mess:', error);
      toast.error('Failed to update mess listing');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mess) return null;

  const facilityOptions = ["Wi-Fi", "Meals", "Laundry", "Lifts", "Water Filter", "Freezer"];
  const roomFeatureOptions = ["Master Bed", "Attached Bath", "Balcony", "Furnished", "AC", "Geyser"];
  const genderOptions = ["Male", "Female"];
  const roomTypeOptions = ["Single", "Shared", "Double", "Suite"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit Mess Listing</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Mess title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price per Month (৳) *</label>
              <Input
                type="number"
                value={formData.payPerMonth}
                onChange={(e) => handleChange('payPerMonth', e.target.value)}
                placeholder="5000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Room Type</label>
              <Select value={formData.roomType} onValueChange={(value) => handleChange('roomType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roomTypeOptions.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender Preference</label>
              <Select value={formData.genderPreference} onValueChange={(value) => handleChange('genderPreference', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map(gender => (
                    <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Advance Payment (Months)</label>
              <Input
                type="number"
                min="1"
                max="3"
                value={formData.advancePaymentMonth}
                onChange={(e) => handleChange('advancePaymentMonth', parseInt(e.target.value))}
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address *</label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Full address"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Contact Number *</label>
            <Input
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              placeholder="01761208866"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your mess service..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Available From</label>
            <Input
              type="date"
              value={formData.availableFrom}
              onChange={(e) => handleChange('availableFrom', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Facilities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {facilityOptions.map(facility => (
                <div key={facility} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`facility-${facility}`}
                    checked={formData.facilities?.includes(facility) || false}
                    onChange={(e) => handleArrayChange('facilities', facility, e.target.checked)}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <label htmlFor={`facility-${facility}`} className="text-sm text-gray-700">
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Room Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roomFeatureOptions.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`feature-${feature}`}
                    checked={formData.roomFeatures?.includes(feature) || false}
                    onChange={(e) => handleArrayChange('roomFeatures', feature, e.target.checked)}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <label htmlFor={`feature-${feature}`} className="text-sm text-gray-700">
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-medium">Name:</span> {mess.owner_name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {mess.owner_email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {mess.owner_phone}
              </div>
            </div>
          </div>
        </form>
        
        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function MessListings() {
  const dispatch = useDispatch();
  
  // ✅ Use adminMess state instead of mess state
  const messes = useSelector((state) => state.adminMess.messes || []);
  const pagination = useSelector((state) => state.adminMess.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalMesses: 0,
    hasNext: false,
    hasPrev: false,
  });
  const filters = useSelector((state) => state.mess.filters); // Keep filters from mess slice
  const isLoading = useSelector((state) => state.adminMess.isLoading);
  
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  
  const [viewModal, setViewModal] = useState({ isOpen: false, mess: null });
  const [editModal, setEditModal] = useState({ isOpen: false, mess: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, mess: null });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const searchParams = {
      ...filters,
      search: debouncedSearch,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
    
    // ✅ Use getAllMesses from admin slice
    dispatch(getAllMesses(searchParams));
  }, [debouncedSearch, filters.page, dispatch]);

  const handleView = async (mess) => {
    try {
      await dispatch(getMessById(mess._id));
      setViewModal({ isOpen: true, mess });
    } catch (error) {
      console.error('Error fetching mess details:', error);
      setViewModal({ isOpen: true, mess });
    }
  };

  const handleEdit = (mess) => {
    setEditModal({ isOpen: true, mess });
  };

  const handleDelete = (mess) => {
    setDeleteModal({ isOpen: true, mess });
  };

  const handleSaveEdit = async (messId, updateData) => {
    try {
      console.log('Updating mess:', messId, updateData);
      
      const result = await dispatch(updateMess({ messId, updateData }));
      
      if (result.payload?.success) {
        toast.success('Mess updated successfully');
        // ✅ Refresh using admin slice
        dispatch(getAllMesses(filters));
      } else {
        toast.error(result.payload?.message || 'Failed to update mess');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update mess listing');
    }
  };

  const handleConfirmDelete = async (messId) => {
    await dispatch(deleteMess({messId})).then(res => {
      if(res?.payload?.success){
        toast.success(res?.payload.message)
      }else{
        toast.error(res?.payload)
      }
    });
    // ✅ Refresh using admin slice
    dispatch(getAllMesses(filters));
  };

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
    dispatch(updateFilters({ page: newPage }));
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
    return `৳ ${price?.toLocaleString()}`;
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

      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
        Filter Options
      </h2>
      
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
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

      <div className="px-4 py-2">
        <p className="text-sm text-gray-600">
          Showing {messes.length} of {pagination.totalMesses} mess listings
        </p>
      </div>

      <h2 className="text-[#0d171b] text-xl sm:text-2xl font-bold px-4 pb-3 pt-5">
        Mess Listings Overview
      </h2>
      
      <div className="px-4 py-3">
        <div className="flex overflow-x-auto rounded-lg border border-[#cfdfe7] bg-slate-50">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-[#0d171b] text-sm font-medium min-w-[200px]">
                 Mess Name
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
                          <DropdownMenuItem onClick={() => handleView(mess)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(mess)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(mess)}
                          >
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
                    {isLoading ? (
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
              disabled={!pagination.hasPrev || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ViewModal
        mess={viewModal.mess}
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, mess: null })}
      />

      <EditModal
        mess={editModal.mess}
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, mess: null })}
        onSave={handleSaveEdit}
      />

      <DeleteModal
        mess={deleteModal.mess}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, mess: null })}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}
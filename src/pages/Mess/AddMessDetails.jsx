import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { addMess, resetAddMessState } from "@/store/mess/messSlice";
import { updateMess, getMessesByOwnerId } from "@/store/mess/ownerMessSlice";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

export default function AddMessDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { addMessLoading, addMessError, addMessSuccess } = useSelector((state) => state.mess);
  const { updateMessLoading, updateMessError, updateMessSuccess } = useSelector((state) => state.owner);
  const { user } = useSelector(state => state.auth);
  
  // Get edit mode and mess data from location state OR localStorage
  const { editMode: locationEditMode, messData: locationMessData } = location.state || {};
  
  // State for edit mode and mess data
  const [editMode, setEditMode] = useState(false);
  const [messData, setMessData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  // Initialize form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    pricing: "",
    advance: "",
    contact: "",
  });

  const [facilities, setFacilities] = useState([]);
  const [roomType, setRoomType] = useState("");
  const [gender, setGender] = useState("");
  const [features, setFeatures] = useState([]);
  const [status, setStatus] = useState("free");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [availableFrom, setAvailableFrom] = useState(null);

  // Load data from localStorage or location.state on component mount
  useEffect(() => {
    const loadEditData = () => {
      try {
        // First check if we have data from location state
        if (locationEditMode && locationMessData && locationMessData._id) {
          setEditMode(true);
          setMessData(locationMessData);
          initializeForm(locationMessData);
          setIsDataLoaded(true);
          return;
        }

        // If no location state, check localStorage
        const storedEditData = localStorage.getItem('editMessData');
        if (storedEditData) {
          const parsedData = JSON.parse(storedEditData);
          // Validate that we have required data
          if (parsedData && parsedData._id) {
            setEditMode(true);
            setMessData(parsedData);
            initializeForm(parsedData);
            setIsDataLoaded(true);
            return;
          }
        }

        // Not in edit mode or invalid data
        setEditMode(false);
        setMessData(null);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error loading edit data:", error);
        toast.error("Failed to load mess data");
        setEditMode(false);
        setMessData(null);
        setIsDataLoaded(true);
      }
    };

    loadEditData();
  }, [locationEditMode, locationMessData]);

  // Initialize form with mess data
  const initializeForm = (data) => {
    if (!data) return;

    setFormData({
      name: data.title || "",
      address: data.address || "",
      description: data.description || "",
      pricing: data.payPerMonth?.toString() || "",
      advance: data.advancePaymentMonth?.toString() || "",
      contact: data.contact || "",
    });

    setFacilities(data.facilities || []);
    setRoomType(data.roomType || "");
    setGender(data.genderPreference || "");
    setFeatures(data.roomFeatures || []);
    setStatus(data.status || "free");
    setAvailableFrom(data.availableFrom ? new Date(data.availableFrom) : null);
  };

  // Show error toast for both add and update
  useEffect(() => {
    if (addMessError) {
      toast.error(addMessError);
    }
    if (updateMessError) {
      toast.error(updateMessError);
    }
  }, [addMessError, updateMessError]);

  // Handle success and redirect
  useEffect(() => {
    if ((addMessSuccess && !editMode) || (updateMessSuccess && editMode)) {
      if (!hasShownSuccess) {
        setHasShownSuccess(true);
        
        if (editMode) {
          toast.success("Mess updated successfully!");
          // Clear localStorage after successful update
          localStorage.removeItem('editMessData');
          
          // Refresh the mess list and redirect
          dispatch(getMessesByOwnerId(user?.id));
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/mess/owner');
          }, 1000);
        } else {
          toast.success("Mess added successfully!");
          resetForm();
        }
        
        const timer = setTimeout(() => {
          setHasShownSuccess(false);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [addMessSuccess, updateMessSuccess, editMode, navigate, dispatch, hasShownSuccess, user?.id]);

  // Input changes  
  const handleField = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  
  const handleCheckbox = (value, state, setState) => e =>
    setState(e.target.checked ? [...state, value] : state.filter(v => v !== value));
  
  const handleRadio = setter => e => setter(e.target.value);

  // Status handler
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  // Date picker handler
  const handleDateChange = (date) => {
    setAvailableFrom(date);
  };

  // Image handling - only for add mode
  const handleImages = e => {
    if (editMode) {
      toast.info("Images cannot be edited. Please delete and recreate the mess to change images.");
      return;
    }

    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      alert("You can upload maximum 3 images.");
      return;
    }
    const allFiles = [...images, ...files].slice(0, 3);
    setImages(allFiles);
    
    // Create new previews and revoke old ones to prevent memory leaks
    setPreviews(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return allFiles.map(f => URL.createObjectURL(f));
    });
  };

  const removeImage = (index) => {
    if (editMode) {
      toast.info("Images cannot be edited. Please delete and recreate the mess to change images.");
      return;
    }

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if we have valid mess data for edit mode
    if (editMode) {
      if (!messData || !messData._id) {
        toast.error("Invalid mess data. Please go back to your listings and try editing again.");
        return;
      }
    }
    
    // Validation for add mode
    if (!editMode && images.length !== 3) {
      toast.error("Please upload exactly 3 images.");
      return;
    }
    
    if (!formData.name || !formData.address || !formData.pricing || !formData.contact || !formData.advance) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!roomType || !gender) {
      toast.error("Please select room type and gender accommodation.");
      return;
    }

    try {
      if (editMode) {
        // Handle edit - send JSON data
        const updateData = {
          title: formData.name,
          address: formData.address,
          description: formData.description,
          payPerMonth: parseInt(formData.pricing),
          advancePaymentMonth: parseInt(formData.advance),
          contact: formData.contact,
          roomType: roomType,
          genderPreference: gender,
          facilities: facilities,
          roomFeatures: features,
          status: status,
          availableFrom: availableFrom ? availableFrom.toISOString() : messData?.availableFrom,
        };

        console.log("Updating mess:", messData._id, updateData);
        const res = await dispatch(updateMess({ 
          messId: messData._id, 
          updateData 
        }))
        if(res.payload.success){
          localStorage.removeItem('editMessData');
          toast.success(res.payload.message)
        }
        
        ;
      } else {
        // Handle add - send FormData
        const submitFormData = new FormData();
        
        // Append all text fields
        submitFormData.append('title', formData.name);
        submitFormData.append('address', formData.address);
        submitFormData.append('owner_id', user.id);
        submitFormData.append('description', formData.description);
        submitFormData.append('payPerMonth', formData.pricing);
        submitFormData.append('advancePaymentMonth', formData.advance);
        submitFormData.append('contact', formData.contact);
        submitFormData.append('roomType', roomType);
        submitFormData.append('genderPreference', gender);
        submitFormData.append('status', status);
        
        if (availableFrom) {
          submitFormData.append('availableFrom', availableFrom.toISOString());
        }
        
        // Append arrays as individual items
        facilities.forEach(facility => {
          submitFormData.append('facilities', facility);
        });
        
        features.forEach(feature => {
          submitFormData.append('roomFeatures', feature);
        });
        
        // Append image files
        images.forEach((image, index) => {
          submitFormData.append('images', image);
        });

        await dispatch(addMess(submitFormData)).unwrap();
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || `Failed to ${editMode ? 'update' : 'add'} mess. Please try again.`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      description: "",
      pricing: "",
      advance: "",
      contact: "",
    });
    setFacilities([]);
    setRoomType("");
    setGender("");
    setFeatures([]);
    setStatus("free");
    setImages([]);
    setPreviews([]);
    setAvailableFrom(null);
    dispatch(resetAddMessState());
  };

  // Show existing images in edit mode
  useEffect(() => {
    if (editMode && messData?.image) {
      setPreviews(messData.image.map(img => img.url));
    }
  }, [editMode, messData]);

  // Get the appropriate loading state
  const isLoading = editMode ? updateMessLoading : addMessLoading;

  // Show loading while data is being loaded
  if (!isDataLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="size-8" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Show error if in edit mode but no valid data
  if (editMode && (!messData || !messData._id)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Mess Data</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the mess data to edit. Please go back to your listings and try again.
          </p>
          <button
            onClick={() => navigate('/mess/owner')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to My Listings
          </button>
        </div>
      </div>
    );
  }

  // Status configuration for styling
  const statusConfig = {
    free: {
      label: "Available",
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      description: "Mess is available for booking"
    },
    booked: {
      label: "Booked",
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      description: "Mess is currently booked"
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      description: "Booking request is pending"
    },
    "in progress": {
      label: "In Progress",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      description: "Booking is being processed"
    }
  };

  return (
    <form className="flex flex-col max-w-[960px] mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-[#0d171b] text-[28px] font-bold text-center pb-3 pt-5">
        {editMode ? "Edit Mess Details" : "Add New Mess Details"}
      </h2>
      
      {/* Status Selection - Only show in edit mode */}
      {editMode && (
        <>
          <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Mess Status</h3>
          <div className="flex gap-3 p-4 flex-wrap">
            {Object.entries(statusConfig).map(([statusValue, config]) => (
              <label 
                key={statusValue}
                className={`text-sm font-medium flex flex-col items-center justify-center rounded-lg border px-4 py-3 cursor-pointer border-[#cfdfe7] min-w-[120px] ${
                  status === statusValue 
                    ? "border-2 border-[#13a4ec] bg-blue-50" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    value={statusValue} 
                    name="status" 
                    checked={status === statusValue} 
                    onChange={() => handleStatusChange(statusValue)} 
                    className="absolute invisible" 
                  />
                  <span className={`w-3 h-3 rounded-full ${
                    statusValue === 'free' ? 'bg-green-500' :
                    statusValue === 'booked' ? 'bg-red-500' :
                    statusValue === 'pending' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></span>
                  {config.label}
                </div>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {config.description}
                </span>
              </label>
            ))}
          </div>

          {/* Current Status Display */}
          <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Status</p>
                <p className={`text-lg font-bold ${
                  status === 'free' ? 'text-green-600' :
                  status === 'booked' ? 'text-red-600' :
                  status === 'pending' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {statusConfig[status]?.label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">
                  {messData?.updatedAt ? new Date(messData.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Property Name */}
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input 
          name="name" 
          value={formData.name} 
          onChange={handleField} 
          placeholder="Property Name" 
          className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" 
          required 
        />
      </div>
      
      {/* Address */}
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input 
          name="address" 
          value={formData.address} 
          onChange={handleField} 
          placeholder="Address" 
          className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" 
          required 
        />
      </div>
      
      {/* Description */}
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleField} 
          placeholder="Description" 
          className="rounded-lg border border-[#cfdfe7] min-h-36 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" 
          rows="4"
        />
      </div>
      
      {/* Available Facilities */}
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Available Facilities</h3>
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {["Wi-Fi", "Meals", "Laundry", "Lifts", "Water Filter", "Freezer"].map(fac => (
          <label key={fac} className="flex gap-3 py-2 items-center">
            <input
              type="checkbox"
              checked={facilities.includes(fac)}
              onChange={handleCheckbox(fac, facilities, setFacilities)}
              className="h-5 w-5 accent-[#13a4ec] border-[#cfdfe7]"
            />
            <span className="text-[#0d171b]">{fac}</span>
          </label>
        ))}
      </div>
      
      {/* Room Types */}
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Room Types</h3>
      <div className="flex gap-3 p-4">
        {["Single", "Shared", "Double"].map(type => (
          <label 
            key={type} 
            className={`text-sm font-medium flex items-center justify-center rounded-lg border px-4 h-11 cursor-pointer border-[#cfdfe7] ${
              roomType === type ? "border-2 border-[#13a4ec] bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            {type}
            <input 
              type="radio" 
              value={type} 
              name="roomType" 
              checked={roomType === type} 
              onChange={handleRadio(setRoomType)} 
              className="absolute invisible" 
              required
            />
          </label>
        ))}
      </div>
      
      {/* Gender Accommodation */}
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Gender Accommodation</h3>
      <div className="flex gap-3 p-4">
        {["Male", "Female"].map(type => (
          <label 
            key={type} 
            className={`text-sm font-medium flex items-center justify-center rounded-lg border px-4 h-11 cursor-pointer border-[#cfdfe7] ${
              gender === type ? "border-2 border-[#13a4ec] bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            {type}
            <input 
              type="radio" 
              value={type} 
              name="gender" 
              checked={gender === type} 
              onChange={handleRadio(setGender)} 
              className="absolute invisible" 
              required
            />
          </label>
        ))}
      </div>
      
      {/* Room Features */}
      <h3 className="text-[#0d171b] text-lg font-bold px-4 pb-2 pt-4">Room Features</h3>
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {["Master Bed", "Balcony", "Attached Bath", "Furnished", "AC", "Geyser"].map(feat => (
          <label key={feat} className="flex gap-3 py-2 items-center">
            <input
              type="checkbox"
              checked={features.includes(feat)}
              onChange={handleCheckbox(feat, features, setFeatures)}
              className="h-5 w-5 accent-[#13a4ec] border-[#cfdfe7]"
            />
            <span className="text-[#0d171b]">{feat}</span>
          </label>
        ))}
      </div>
      
      {/* Pricing */}
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input 
          name="pricing" 
          value={formData.pricing} 
          onChange={handleField} 
          placeholder="Monthly Price (BDT)" 
          type="number"
          min="0"
          className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" 
          required 
        />
      </div>
      
      {/* Available From Date */}
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <DatePicker
          selected={availableFrom}
          onChange={handleDateChange}
          placeholderText="Enter available from date"
          className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
          isClearable
          showYearDropdown
          scrollableYearDropdown
          required
        />
      </div>
      
      {/* Advance Payment */}
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <select 
          name="advance" 
          value={formData.advance} 
          onChange={handleField} 
          className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full"
          required
        >
          <option value="">Advance Payment (Months)</option>
          <option value="1">One Month</option>
          <option value="2">Two Months</option>
          <option value="3">Three Months</option>
        </select>
      </div>
      
      {/* Contact Information */}
      <div className="flex max-w-[480px] gap-4 px-4 py-3">
        <input 
          name="contact" 
          value={formData.contact} 
          onChange={handleField} 
          placeholder="Contact Number" 
          type="tel"
          className="rounded-lg border border-[#cfdfe7] h-14 p-4 bg-slate-50 w-full placeholder:text-[#4c809a]" 
          required 
        />
      </div>
      
      {/* Upload Images */}
      <div className="flex flex-col p-4">
        <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-[#cfdfe7] px-6 py-14">
          <div className="flex flex-col items-center gap-2 text-center">
            {editMode ? (
              <>
                <p className="text-red-500 font-medium mb-2">Images cannot be edited</p>
                <p className="text-[#0d171b] text-sm">
                  Delete and recreate the mess to change images
                </p>
              </>
            ) : (
              <>
                <p className="text-[#0d171b] text-lg font-bold">Upload Photos (3 required)</p>
                <p className="text-[#0d171b] text-sm">Drag and drop or click to upload</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="hidden"
                  id="mess-photos-uploader"
                />
              </>
            )}
          </div>
          
          {!editMode && (
            <label 
              htmlFor="mess-photos-uploader" 
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7eff3] text-[#0d171b] text-sm font-bold hover:bg-[#d8e4ea] transition-colors"
            >
              Choose Files
            </label>
          )}
          
          {/* Image Previews */}
          {(previews.length > 0 || (editMode && messData?.image)) && (
            <div className="mt-4">
              <p className="text-sm text-[#4c809a] mb-3 text-center">
                {editMode ? "Current Images" : `${images.length}/3 photos uploaded`}
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img 
                      src={src} 
                      alt={`Mess ${editMode ? '' : 'preview '}${i + 1}`} 
                      className="h-20 w-20 rounded border object-cover" 
                    />
                    {!editMode && (
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex px-4 py-3">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex flex-1 items-center justify-center rounded-lg h-12 px-4 bg-[#13a4ec] text-slate-50 text-sm font-bold hover:bg-[#0f8cc7] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner className="size-4" />
              {editMode ? "Updating Mess..." : "Adding Mess..."}
            </span>
          ) : (
            editMode ? "Update Mess Details" : "Submit Mess Details"
          )}
        </button>
      </div>
    </form>
  );
}
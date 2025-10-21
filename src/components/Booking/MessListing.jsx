import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
  Star,
  ClipboardClock,
  ChevronsLeftRightEllipsis,
  X,
  Save,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  deleteMess,
  getMessesByOwnerId,
  updateMessStatus,
  updateMess,
} from "@/store/mess/ownerMessSlice";
import { Spinner } from "../ui/spinner";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getStatusStyle = (status) => {
  const styles = {
    free: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    booked: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    "in progress":
      "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  };
  return styles[status] || styles.free;
};

const getStatusDisplayText = (status) => {
  const statusMap = {
    free: "Available",
    booked: "Booked",
    pending: "Pending",
    "in progress": "In Progress",
    in_progress: "In Progress",
  };
  return statusMap[status] || "Available";
};

// Status Update Dialog Component
const StatusUpdateDialog = ({ mess, onStatusUpdate, isUpdating }) => {
  const [selectedStatus, setSelectedStatus] = useState(mess.status);

  const statusOptions = [
    {
      value: "free",
      label: "Available",
      description: "Mess is available for new bookings",
      color: "text-green-600",
    },
    {
      value: "booked",
      label: "Booked",
      description: "Mess has been booked by a tenant",
      color: "text-red-600",
    },
    {
      value: "pending",
      label: "Pending",
      description: "Waiting for booking confirmation",
      color: "text-yellow-600",
    },
    {
      value: "in progress",
      label: "In Progress",
      description: "Booking process is ongoing",
      color: "text-blue-600",
    },
  ];

  const handleSubmit = () => {
    if (selectedStatus !== mess.status) {
      onStatusUpdate(mess._id, selectedStatus);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="gap-2 text-blue-600 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <ChevronsLeftRightEllipsis className="w-4 h-4" />
          Update Status
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Mess Status</DialogTitle>
          <DialogClose>
            <X className="w-4 h-4" />
          </DialogClose>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{mess.title}</h4>
              <p className="text-sm text-gray-600">{mess.address}</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Select New Status
              </label>

              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStatus === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedStatus(option.value)}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={selectedStatus === option.value}
                        onChange={() => setSelectedStatus(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-gray-900">
                        <span className={option.color}>{option.label}</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Current Status:</strong>{" "}
                <span
                  className={
                    getStatusStyle(mess.status) + " px-2 py-1 rounded text-xs"
                  }
                >
                  {getStatusDisplayText(mess.status)}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>New Status:</strong>{" "}
                <span
                  className={
                    statusOptions.find((opt) => opt.value === selectedStatus)
                      ?.color + " font-medium"
                  }
                >
                  {
                    statusOptions.find((opt) => opt.value === selectedStatus)
                      ?.label
                  }
                </span>
              </p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isUpdating}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={selectedStatus === mess.status || isUpdating}
            className="gap-2"
          >
            {isUpdating ? (
              <>
                <Spinner className="w-4 h-4" />
                Updating...
              </>
            ) : (
              <>Update Status</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Edit Mess Dialog Component
const EditMessDialog = ({ mess, onEditSubmit, isUpdating }) => {
  const [formData, setFormData] = useState({
    title: mess.title || "",
    description: mess.description || "",
    address: mess.address || "",
    payPerMonth: mess.payPerMonth || "",
    roomType: mess.roomType || "single",
    genderPreference: mess.genderPreference || "male",
    facilities: mess.facilities || [],
  });

  const [newFacility, setNewFacility] = useState("");

  const roomTypes = [
    { value: "single", label: "Single Room" },
    { value: "double", label: "Double Room" },
    { value: "shared", label: "Shared Room" },
  ];

  const genderOptions = [
    { value: "male", label: "Male Only" },
    { value: "female", label: "Female Only" },
  ];

  const commonFacilities = [
    "Wi-Fi",
    "Meals",
    "Laundry",
    "Lifts",
    "Water Filter",
    "Freezer",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleAddFacility = () => {
  //   if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
  //     setFormData(prev => ({
  //       ...prev,
  //       facilities: [...prev.facilities, newFacility.trim()]
  //     }));
  //     setNewFacility("");
  //   }
  // };

  const handleRemoveFacility = (facilityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facilityToRemove),
    }));
  };

  const handleCommonFacilityClick = (facility) => {
    if (!formData.facilities.includes(facility)) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facility],
      }));
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.address.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.payPerMonth || formData.payPerMonth <= 0) {
      toast.error("Please enter a valid monthly rent");
      return;
    }
    // dispatch(updateMess())
    onEditSubmit(mess._id, formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <Edit className="w-4 h-4" />
          Edit Details
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Mess Details</DialogTitle>
          <DialogClose>
            <X className="w-4 h-4" />
          </DialogClose>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Mess Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter mess title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your mess, facilities, rules, etc."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Full address of the mess"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing & Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payPerMonth">Monthly Rent (BDT) *</Label>
                  <Input
                    id="payPerMonth"
                    type="number"
                    value={formData.payPerMonth}
                    onChange={(e) =>
                      handleInputChange("payPerMonth", e.target.value)
                    }
                    placeholder="Enter monthly rent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type *</Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(value) =>
                      handleInputChange("roomType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genderPreference">Gender Preference *</Label>
                  <Select
                    value={formData.genderPreference}
                    onValueChange={(value) =>
                      handleInputChange("genderPreference", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Facilities & Amenities</h3>

              <div className="space-y-3">
                <Label>Current Facilities</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.facilities.map((facility, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(facility)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  {formData.facilities.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No facilities added yet
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Common Facilities</Label>
                <div className="flex flex-wrap gap-2">
                  {commonFacilities.map((facility) => (
                    <Badge
                      key={facility}
                      variant={
                        formData.facilities.includes(facility)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleCommonFacilityClick(facility)}
                    >
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isUpdating}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="gap-2"
          >
            {isUpdating ? (
              <>
                <Spinner className="w-4 h-4" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Mess
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const Messlisting = () => {
  const { user } = useSelector((state) => state.auth);
  const { ownerMesses, isUpdating } = useSelector((state) => state.owner);
  const { isLoading } = useSelector((state) => state.mess);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessesByOwnerId(user?.id));
  }, [dispatch, user?.id]);

  const handleEdit = async (messId, formData) => {
    try {
      const result = await dispatch(
        updateMess({ messId, updateData: formData })
      ).unwrap();

      if (result?.success) {
        toast.success(result.message || "Mess updated successfully");
        dispatch(getMessesByOwnerId(user?.id));
      } else {
        toast.error(result?.message || "Failed to update mess");
      }
    } catch (error) {
      toast.error("Failed to update mess details");
      console.error("Edit mess error:", error);
    }
  };

  const handleDelete = async (messId) => {
    if (window.confirm("Are you sure you want to delete this mess?")) {
      const res = await dispatch(deleteMess(messId)).unwrap();
      dispatch(getMessesByOwnerId(user?.id));
    }
  };

  const handleViewDetails = (messId) => {
    navigate(`/mess/info/${messId}`);
  };

  const handleStatusUpdate = async (mess_id, selectedStatus) => {
    await dispatch(updateMessStatus({ mess_id, status: selectedStatus }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res.message);
          dispatch(getMessesByOwnerId(user?.id));
        } else {
          toast.error("Failed to update status");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Mess Listings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all your mess properties in one place
            </p>
          </div>
          <Link to="/mess/add">
            <Button variant="nav" className="whitespace-nowrap gap-2">
              <Plus className="w-4 h-4" />
              Add New Mess
            </Button>
          </Link>
        </div>

        {/* Tabs for Filtering */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-5">
            <TabsTrigger value="all">All Listings</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="booked">Booked</TabsTrigger>
          </TabsList>

          {/* Tab contents */}
          <TabsContent value="all" className="mt-6">
            <MessGrid
              messes={ownerMesses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter((mess) => mess.status === "free")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="in_progress" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter(
                (mess) =>
                  mess.status === "in progress" || mess.status === "in_progress"
              )}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter((mess) => mess.status === "pending")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          </TabsContent>

          <TabsContent value="booked" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter((mess) => mess.status === "booked")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {ownerMesses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No mess listings yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by adding your first mess listing to attract potential
                tenants.
              </p>
              <Link to="/mess/add">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Mess
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// MessGrid Component
const MessGrid = ({
  messes,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusUpdate,
  isUpdating,
}) => {
  if (messes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No messes found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {messes.map((mess) => (
        <MessCard
          key={mess._id}
          mess={mess}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onStatusUpdate={onStatusUpdate}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};

// MessCard Component
// MessCard Component
const MessCard = ({
  mess,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusUpdate,
  isUpdating,
  isLoading,
}) => {
  const { isDeleting } = useSelector((state) => state.owner);

  // Skeleton Loading Component
  if (isLoading) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-pulse">
        {/* Image Skeleton */}
        <div className="relative">
          <div className="w-full h-48 bg-gray-300"></div>
          <div className="absolute top-3 left-3">
            <div className="h-6 w-20 bg-gray-400 rounded-full"></div>
          </div>
          <div className="absolute top-3 right-3">
            <div className="h-8 w-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-5 bg-gray-300 rounded w-10"></div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className="h-4 bg-gray-300 rounded w-4"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
          </div>

          {/* Facilities Skeleton */}
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              <div className="h-6 bg-gray-300 rounded w-16"></div>
              <div className="h-6 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-14"></div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-4 bg-gray-300 rounded w-4"></div>
              <div className="h-4 bg-gray-300 rounded w-12"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 bg-gray-300 rounded w-4"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Actual Mess Card Component
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src={
            mess.image?.[0]?.url ||
            mess.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1564013796-b-30d5d1c-37?w=400"
          }
          alt={mess.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge
            className={`font-medium transition-colors ${getStatusStyle(
              mess.status
            )}`}
          >
            {getStatusDisplayText(mess.status)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onViewDetails(mess._id)}
              >
                <Eye className="w-4 h-4" />
                View Details
              </DropdownMenuItem>

              {/* Edit Dialog Trigger */}
              {mess.status !== "booked" && (
                <EditMessDialog
                  mess={mess}
                  onEditSubmit={onEdit}
                  isUpdating={isUpdating}
                />
              )}

              <DropdownMenuSeparator />

              {/* Status Update Dialog Trigger */}
              {mess?.status && mess.status !== "booked" ? (
                <StatusUpdateDialog
                  mess={mess}
                  onStatusUpdate={onStatusUpdate}
                  isUpdating={isUpdating}
                />
              ) : null}

              <DropdownMenuSeparator />
              {mess.status === "free" && (
                <DropdownMenuItem
                  className="gap-2 text-red-600 cursor-pointer"
                  onClick={() => onDelete(mess._id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight">{mess.title}</CardTitle>
          <div className="flex items-center gap-1 text-amber-600">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">
              {mess.ratingInfo?.averageRating || "0.0"}
            </span>
          </div>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <MapPin className="w-3 h-3" />
          {mess.address}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {mess.description}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Monthly Rent</span>
            <span className="font-semibold text-green-600">
              ৳ {mess.payPerMonth}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Room Type</span>
            <Badge variant="outline" className="capitalize">
              {mess.roomType}
            </Badge>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Gender</span>
            <Badge variant="outline" className="capitalize">
              {mess.genderPreference}
            </Badge>
          </div>
        </div>

        {/* Facilities */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {mess.facilities?.slice(0, 3).map((facility, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {facility}
              </Badge>
            ))}
            {mess.facilities?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mess.facilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 flex justify-between items-center">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {mess.view || 0} views
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {mess.ratingInfo?.totalReviews || 0} reviews
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Messlisting;

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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { deleteMess, getMessesByOwnerId } from "@/store/mess/ownerMessSlice";
import { Spinner } from "../ui/spinner";

const getStatusStyle = (status) => {
  const styles = {
    free: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    booked: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    'in progress': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200', // backup for both formats
  };
  return styles[status] || styles.free;
};

const getStatusDisplayText = (status) => {
  const statusMap = {
    free: "Available",
    booked: "Booked",
    pending: "Pending",
    'in progress': "In Progress",
    in_progress: "In Progress" 
  };
  return statusMap[status] || "Available";
};

export const Messlisting = () => {
  const { user } = useSelector((state) => state.auth);
  const { ownerMesses } = useSelector((state) => state.owner);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getMessesByOwnerId(user?.id));
  }, [dispatch, user?.id]);

  // Function to handle edit - navigates to AddMess page with mess data
  const handleEdit = (mess) => {
     localStorage.setItem('editMessData', JSON.stringify(mess));
    navigate('/mess/add', { state: { editMode: true, messData: mess } });
  };

  // Function to handle delete
  const handleDelete = async (messId) => {
    if (window.confirm("Are you sure you want to delete this mess?")) {
      
        // Wait for the delete operation to complete
       const res =  await dispatch(deleteMess(messId)).unwrap();
       dispatch(getMessesByOwnerId(user?.id))
    }
  };

  // Function to handle view details
  const handleViewDetails = (messId) => {
    navigate(`/mess/info/${messId}`);
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Listings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {ownerMesses.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      ownerMesses.filter((mess) => mess.status === "free")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {
                      ownerMesses.filter((mess) => 
                        mess.status === "in progress" || mess.status === "in_progress"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ClipboardClock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      ownerMesses.filter((mess) => mess.status === "pending")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ClipboardClock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Booked</p>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      ownerMesses.filter((mess) => mess.status === "booked")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {ownerMesses.reduce((sum, mess) => sum + (mess.view || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
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

          <TabsContent value="all" className="mt-6">
            <MessGrid
              messes={ownerMesses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter((mess) => mess.status === "free")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>

          <TabsContent value="in_progress" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter((mess) => 
                mess.status === "in progress" || mess.status === "in_progress"
              )}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter((mess) => mess.status === "pending")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>

          <TabsContent value="booked" className="mt-6">
            <MessGrid
              messes={ownerMesses.filter((mess) => mess.status === "booked")}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
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

// Separate Mess Grid Component
const MessGrid = ({ messes, onEdit, onDelete, onViewDetails }) => {
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
        />
      ))}
    </div>
  );
};

// Individual Mess Card Component
const MessCard = ({ mess, onEdit, onDelete, onViewDetails }) => {
    const {isDeleting} = useSelector(state=>state.owner)
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
            className={`font-medium transition-colors ${getStatusStyle(mess.status)}`}
          >
            {getStatusDisplayText(mess.status)}
          </Badge>
          {
            isDeleting && <Badge
            className={`font-medium bg-red-600 text-white transition-colors`}
          >
            <Spinner/> Deleting
          </Badge>
          }
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
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onEdit(mess)}
              >
                <Edit className="w-4 h-4" />
                Edit Listing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-red-600 cursor-pointer"
                onClick={() => onDelete(mess._id)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
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
            <span className="font-semibold text-green-600 flex items-center gap-1">
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
        <Button variant="outline" size="sm" onClick={() => onEdit(mess)}>
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Messlisting;
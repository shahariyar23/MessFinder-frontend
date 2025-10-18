import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Calendar,
  User,
  Home,
  Clock,
  CheckCircle2,
  XCircle,
  Clock4,
  Eye
} from "lucide-react";
import { toast } from "react-toastify";
import { Spinner } from "../ui/spinner";
import { getAllRequests, updateRequestStatus, getMyRequests } from "@/store/mess/requestMessSlice";

const RequestView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  const { 
    requests, 
    requestsLoading, 
    updateLoading,
    myRequests,
    myRequestsLoading 
  } = useSelector((state) => state.request);

  const { user } = useSelector((state) => state.auth); // Get user from auth state
  
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Determine user role and set appropriate data
  const isOwner = user?.role === 'owner';
  const isStudent = user?.role === 'student';
  const displayRequests = isOwner ? requests : myRequests;
  const displayLoading = isOwner ? requestsLoading : myRequestsLoading;

  // Fetch requests based on user role
  useEffect(() => {
    if (isOwner && userId) {
      console.log("Fetching owner requests for owner ID:", userId);
      dispatch(getAllRequests({ ownerId: userId }));
    } else if (isStudent) {
      console.log("Fetching student requests");
      dispatch(getMyRequests());
    }
  }, [dispatch, userId, isOwner, isStudent]);

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = displayRequests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => {
        if (isOwner) {
          // For owner: search in user info
          const user = request.userId || request.user || {};
          return (
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm)
          );
        } else {
          // For student: search in mess info
          const mess = request.messId || request.mess || {};
          return (
            mess.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mess.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mess.address?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, displayRequests, isOwner]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const result = await dispatch(updateRequestStatus({ 
        requestId, 
        status: newStatus 
      })).unwrap();
      
      toast.success(`Request ${newStatus} successfully`);
      setIsDialogOpen(false);
      
      // Refresh the requests list to get updated data
      if (isOwner && userId) {
        dispatch(getAllRequests({ ownerId: userId }));
      } else if (isStudent) {
        dispatch(getMyRequests());
      }
    } catch (error) {
      toast.error(error || "Failed to update request status");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", icon: Clock4, label: "Pending" },
      accepted: { variant: "success", icon: CheckCircle2, label: "Accepted" },
      rejected: { variant: "destructive", icon: XCircle, label: "Rejected" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-24 justify-center">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserInfo = (request) => {
    const user = request.userId || request.user || {};
    return {
      name: user.name || 'N/A',
      email: user.email || 'N/A',
      phone: user.phone || 'N/A'
    };
  };

  const getMessInfo = (request) => {
    const mess = request.messId || request.mess || {};
    return {
      name: mess.name || 'N/A',
      location: mess.location || 'N/A',
      address: mess.address || 'N/A'
    };
  };

  const getTableHeaders = () => {
    if (isOwner) {
      return (
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Mess</TableHead>
          <TableHead>Requested Date</TableHead>
          <TableHead>Preferred Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Requested On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    } else {
      return (
        <TableRow>
          <TableHead>Mess</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Requested Date</TableHead>
          <TableHead>Preferred Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Requested On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      );
    }
  };

  const getTableRow = (request) => {
    const userInfo = getUserInfo(request);
    const messInfo = getMessInfo(request);
    
    if (isOwner) {
      return (
        <TableRow key={request._id || request.id}>
          <TableCell>
            <div>
              <div className="font-medium">{userInfo.name}</div>
              <div className="text-sm text-muted-foreground">
                {userInfo.email}
              </div>
              <div className="text-sm text-muted-foreground">
                {userInfo.phone}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="font-medium">{messInfo.name}</div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatDate(request.requestedDate)}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {request.preferredTime || 'Not specified'}
            </div>
          </TableCell>
          <TableCell>
            {getStatusBadge(request.status)}
          </TableCell>
          <TableCell>
            {formatDate(request.createdAt)}
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDialogOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {request.status === "pending" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(request._id || request.id, "accepted")}
                      className="text-green-600 cursor-pointer"
                      disabled={updateLoading}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {updateLoading ? 'Updating...' : 'Accept Request'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(request._id || request.id, "rejected")}
                      className="text-red-600 cursor-pointer"
                      disabled={updateLoading}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {updateLoading ? 'Updating...' : 'Reject Request'}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow key={request._id || request.id}>
          <TableCell>
            <div>
              <div className="font-medium">{messInfo.name}</div>
              <div className="text-sm text-muted-foreground">
                {messInfo.address}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="font-medium">{messInfo.location}</div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatDate(request.requestedDate)}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {request.preferredTime || 'Not specified'}
            </div>
          </TableCell>
          <TableCell>
            {getStatusBadge(request.status)}
          </TableCell>
          <TableCell>
            {formatDate(request.createdAt)}
          </TableCell>
          <TableCell className="text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedRequest(request);
                setIsDialogOpen(true);
              }}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      );
    }
  };

  if (displayLoading) {
    return (
      <div className="container mx-auto p-6 pt-20">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Spinner className="h-12 w-12 border-b-2 border-primary mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isOwner ? "Viewing Requests" : "My Requests"}
            </h1>
            <p className="text-muted-foreground">
              {isOwner 
                ? "Manage and respond to mess viewing requests" 
                : "Track your mess viewing requests"
              }
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className="text-lg px-3 py-1">
          {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  isOwner 
                    ? "Search by name, email, or phone..." 
                    : "Search by mess name, location..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isOwner ? "Viewing Requests" : "My Requests"}
          </CardTitle>
          <CardDescription>
            {isOwner 
              ? "All requests from users who want to view your mess" 
              : "Your mess viewing request history"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : isOwner 
                    ? "No viewing requests yet" 
                    : "You haven't made any requests yet"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {getTableHeaders()}
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => getTableRow(request))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (() => {
            const userInfo = getUserInfo(selectedRequest);
            const messInfo = getMessInfo(selectedRequest);
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Request Details</DialogTitle>
                  <DialogDescription>
                    Complete information about the viewing request
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  {isOwner ? (
                    // Owner View
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="userName">User Name</Label>
                          <Input id="userName" value={userInfo.name} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userEmail">Email</Label>
                          <Input id="userEmail" value={userInfo.email} readOnly />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="userPhone">Phone</Label>
                          <Input id="userPhone" value={userInfo.phone} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="messName">Mess Name</Label>
                          <Input id="messName" value={messInfo.name} readOnly />
                        </div>
                      </div>
                    </>
                  ) : (
                    // Student View
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="messName">Mess Name</Label>
                          <Input id="messName" value={messInfo.name} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="messLocation">Location</Label>
                          <Input id="messLocation" value={messInfo.location} readOnly />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="messAddress">Address</Label>
                        <Input id="messAddress" value={messInfo.address} readOnly />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <div className="pt-2">
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <Input id="preferredTime" value={selectedRequest.preferredTime || 'Not specified'} readOnly />
                    </div>
                  </div>

                  {selectedRequest.requestedDate && (
                    <div className="space-y-2">
                      <Label htmlFor="requestedDate">Requested Viewing Date</Label>
                      <Input id="requestedDate" value={formatDate(selectedRequest.requestedDate)} readOnly />
                    </div>
                  )}

                  {selectedRequest.additionalNotes && (
                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <div className="p-3 border rounded-md bg-muted/50">
                        {selectedRequest.additionalNotes}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  {isOwner && selectedRequest.status === "pending" && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusUpdate(selectedRequest._id || selectedRequest.id, "rejected")}
                        disabled={updateLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {updateLoading ? 'Updating...' : 'Reject'}
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleStatusUpdate(selectedRequest._id || selectedRequest.id, "accepted")}
                        disabled={updateLoading}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {updateLoading ? 'Updating...' : 'Accept Request'}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={updateLoading}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestView;
import { getSavedMesses, unsaveMess } from "@/store/mess/saveMessSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MapPin, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import { sendMessViewRequest } from "@/store/mess/requestMessSlice";
import { toast } from "react-toastify";

const BookingListing = () => {
  const dispatch = useDispatch();
  const { pagination, savedMesses, loading } = useSelector(
    (state) => state.save
  );
  console.log(savedMesses)
  const nevigate = useNavigate();
  useEffect(() => {
    dispatch(getSavedMesses());
  }, [dispatch]);
  const handleRequest = async (messId, ownerId) => {
  try {
    await dispatch(sendMessViewRequest({ messId, ownerId})).unwrap();
    toast.success("Request sent successfully! Owner will contact you.");
  } catch (error) {
    toast.error(`Failed to send request: ${error}`);
  }
};
const handelUnsaveBookmark = (messId) =>{
        dispatch(unsaveMess(messId)).then(res=>{
      if(res?.payload?.success){
        dispatch(getSavedMesses())
        toast.success(res?.payload?.message);
      }else{
        console.log(res);
        
        toast.error(res?.payload);
   }}) 
}
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      accepted: { variant: "success", label: "Accepted" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatPrice = (price) => {
    return `৳${price}/month`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 pt-20">
        <div className="grid gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="h-48 md:h-32 md:w-48 rounded-lg flex-1" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Messes</h1>
          <p className="text-muted-foreground mt-2">
            {savedMesses.length} mess{savedMesses.length !== 1 ? "es" : ""}{" "}
            saved
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pagination.totalSaved || savedMesses.length} Total
        </Badge>
      </div>

      {/* Saved Messes List */}
      <div className="grid gap-6">
        {savedMesses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No saved messes yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start exploring messes and save your favorites for later!
              </p>
              <Button onClick={() => (window.location.href = "/mess/listing")}>
                Browse Messes
              </Button>
            </CardContent>
          </Card>
        ) : (
          savedMesses.map((savedItem) => {
            console.log(savedItem?.owner._id)
            const mess = savedItem.mess || savedItem.messId;
            if (!mess) return null;

            return (
              <Card
                key={savedItem.id || savedItem._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Mess Image */}
                    <div className="flex-1 md:max-w-48">
                      <div
                        className="w-full h-48 md:h-32 bg-cover bg-center rounded-lg"
                        style={{
                          backgroundImage:
                            mess.images && mess.images.length > 0
                              ? `url("${mess.images[0]}")`
                              : 'url("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
                        }}
                      />
                    </div>

                    {/* Mess Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-[#0d171b] mb-1">
                            {mess.title || "Unnamed Mess"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {mess.location || "Location not specified"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-sky-500 mb-1">
                            {mess.payPerMonth
                              ? formatPrice(mess.payPerMonth)
                              : "Price not set"}
                          </div>
                          {savedItem.status && getStatusBadge(savedItem.status)}
                        </div>
                      </div>

                      {/* Address */}
                      {mess.address && (
                        <p className="text-sm text-[#4c809a] mb-3">
                          {mess.address}
                        </p>
                      )}

                      {/* Facilities */}
                      {mess.facilities && mess.facilities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {mess.facilities
                            .slice(0, 3)
                            .map((facility, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {facility}
                              </Badge>
                            ))}
                          {mess.facilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{mess.facilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {mess.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{mess.rating}</span>
                          </div>
                        )}
                        {mess.capacity && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Capacity: {mess.capacity}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="bg-[#e7eff3] text-[#0d171b] hover:bg-[#d4e3e9]"
                          onClick={() => nevigate(`/mess/info/${mess?._id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleRequest(mess?._id, savedItem?.owner?._id)
                          }
                        >
                          Request to View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={()=> handelUnsaveBookmark(mess?._id)}
                          // Add unsave functionality here
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>

                      {/* Saved Date */}
                      <div className="mt-3 text-xs text-muted-foreground">
                        Saved on{" "}
                        {new Date(savedItem.savedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination - Add if needed */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                dispatch(getSavedMesses({ page: pagination.currentPage - 1 }))
              }
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                dispatch(getSavedMesses({ page: pagination.currentPage + 1 }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingListing;

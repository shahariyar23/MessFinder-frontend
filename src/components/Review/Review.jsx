// components/Review/Review.jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { getUserReviews, createReview } from "@/store/mess/reviewSlice";
import { toast } from "react-toastify";

const Review = () => {
  const [tabValue, setTabvalue] = useState("to_be_reviewed");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    userReviews,
    userReviewsLoading,
    userReviewsPagination,
    error
  } = useSelector((state) => state.review);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserReviews({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleTabChange = (value) => {
    setTabvalue(value);
  };

  const handleLoadMore = () => {
    const currentPage = userReviewsPagination.currentPage;
    if (currentPage < userReviewsPagination.totalPages) {
      dispatch(getUserReviews({ page: currentPage + 1, limit: 10 }));
    }
  };

  // Filter bookings based on review status
  const toBeReviewedBookings = userReviews?.filter(booking => booking.canReview) || [];
  const reviewedHistoryBookings = userReviews?.filter(booking => booking.hasReview) || [];

  // Get counts from the actual data
  const reviewCounts = {
    toBeReviewed: toBeReviewedBookings.length,
    history: reviewedHistoryBookings.length
  };

  const handleOpenReviewDialog = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment("");
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedBooking(null);
    setRating(0);
    setComment("");
    setHoverRating(0);
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking || rating === 0 || !comment.trim()) {
      alert("Please provide both rating and comment");
      return;
    }

    if (comment.trim().length > 1000) {
      alert("Comment must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        mess_id: selectedBooking.mess_id,
        booking_id: selectedBooking.booking_id,
        rating: rating,
        comment: comment.trim()
      };

      await dispatch(createReview(reviewData)).unwrap().then(res=>{
        console.log(res)
      });
      
      dispatch(getUserReviews({ page: 1, limit: 50 }));
      handleCloseReviewDialog();
      toast.success("Review submitted successfully!");
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Star Rating Component
  const StarRating = ({ rating, onRatingChange, hoverRating, onHoverChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            type="button"
            variant="ghost"
            size="icon"
            className="h-12 w-12 hover:bg-transparent p-1 focus:outline-none"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange(star)}
            onMouseLeave={() => onHoverChange(0)}
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
            />
          </Button>
        ))}
      </div>
    );
  };

  // Loading skeleton for review cards
  const ReviewSkeleton = () => (
    <Card className="w-full max-w-[480px]">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Loading skeleton for the empty state image
  const ImageSkeleton = () => (
    <Skeleton className="aspect-video rounded-lg w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] h-[180px] sm:h-[200px] md:h-[220px]" />
  );

  // Booking card component for "To be Reviewed" tab
  const ToBeReviewedCard = ({ booking }) => (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{booking.messTitle}</h3>
              <p className="text-sm text-muted-foreground">{booking.messAddress}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-muted-foreground">Room: {booking.roomType}</span>
                <span className="text-muted-foreground">BDT {booking.payPerMonth}/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
            </div>
            {booking.messImage && (
              <img 
                src={booking.messImage} 
                alt={booking.messTitle}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className={`px-2 py-1 rounded text-xs ${
              booking.bookingStatus === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            }`}>
              {booking.bookingStatus}
            </span>
            <Button 
            variant="nav"
              onClick={() => handleOpenReviewDialog(booking)}
              // className="bg-primary hover:bg-primary/90"
            >
              Write Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-3">
      <Tabs 
        defaultValue="to_be_reviewed" 
        value={tabValue}
        onValueChange={handleTabChange}
        className="min-h-screen w-full"
      >
        <TabsList className="flex bg-transparent gap-2">
          <TabsTrigger
            value="to_be_reviewed"
            className="flex items-center justify-start gap-3 px-3 rounded-lg w-full data-[state=active]:text-primary"
          >
            To be Reviewed {reviewCounts.toBeReviewed > 0 && `(${reviewCounts.toBeReviewed})`}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center justify-start gap-3 px-3 rounded-lg w-full data-[state=active]:text-primary"
          >
            History {reviewCounts.history > 0 && `(${reviewCounts.history})`}
          </TabsTrigger>
        </TabsList>
        
        {/* To be Reviewed Tab */}
        <TabsContent value="to_be_reviewed">
          <div className="flex flex-wrap justify-between items-center gap-4 p-2 sm:p-4">
            <Skeleton className={`h-8 sm:h-12 min-w-32 sm:min-w-72 ${userReviewsLoading ? '' : 'hidden'}`} />
            <p className={`text-foreground font-bold min-w-32 sm:min-w-72 text-2xl sm:text-4xl ${userReviewsLoading ? 'hidden' : ''}`}>
              Reviews
            </p>
          </div>
          
          <Skeleton className={`h-8 w-40 mx-2 mb-4 ${userReviewsLoading ? '' : 'hidden'}`} />
          <h2 className={`text-foreground font-bold px-2 pb-2 pt-3 text-xl sm:text-2xl ${userReviewsLoading ? 'hidden' : ''}`}>
            To be Reviewed {reviewCounts.toBeReviewed > 0 && `(${reviewCounts.toBeReviewed})`}
          </h2>
          
          <div className="flex flex-col px-2 sm:px-4 py-6 items-center gap-6">
            {userReviewsLoading ? (
              <>
                <ImageSkeleton />
                <div className="flex flex-col w-full max-w-[360px] sm:max-w-[480px] items-center gap-4 px-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </>
            ) : toBeReviewedBookings.length > 0 ? (
              <div className="w-full space-y-4">
                {toBeReviewedBookings.map((booking) => (
                  <ToBeReviewedCard key={booking.booking_id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-4 p-8">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                  <Star className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">No reviews pending</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You don't have any pending reviews. Complete your bookings to review mess services.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Skeleton className={`h-8 w-32 mx-4 mb-4 ${userReviewsLoading ? '' : 'hidden'}`} />
          <h2 className={`text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 ${userReviewsLoading ? 'hidden' : ''}`}>
            Review History {reviewCounts.history > 0 && `(${reviewCounts.history})`}
          </h2>
          
          {userReviewsLoading ? (
            <div className="px-4 space-y-4">
              {[...Array(3)].map((_, index) => (
                <ReviewSkeleton key={index} />
              ))}
            </div>
          ) : reviewedHistoryBookings.length > 0 ? (
            <div className="px-4 space-y-4">
              {reviewedHistoryBookings.map((booking) => (
                <Card key={booking.booking_id} className="w-full">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">{booking.messTitle}</h3>
                          <p className="text-sm text-muted-foreground">{booking.messAddress}</p>
                        </div>
                        {booking.messImage && (
                          <img 
                            src={booking.messImage} 
                            alt={booking.messTitle}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                      </div>
                      
                      {booking.existingReview && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < booking.existingReview.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {booking.existingReview.rating}/5
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{booking.existingReview.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Reviewed on {new Date(booking.existingReview.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Star className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-foreground font-bold text-lg mb-2">No review history</p>
              <p className="text-muted-foreground text-sm">You haven't reviewed any mess services yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this mess to help others.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              {/* Mess Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {selectedBooking.messImage && (
                  <img 
                    src={selectedBooking.messImage} 
                    alt={selectedBooking.messTitle}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-foreground">{selectedBooking.messTitle}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.roomType} • BDT {selectedBooking.payPerMonth}/month
                  </p>
                </div>
              </div>

              {/* Rating Section */}
              <div className="space-y-3">
                <Label htmlFor="rating">Rating *</Label>
                <div className="flex flex-col items-center gap-2">
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    hoverRating={hoverRating}
                    onHoverChange={setHoverRating}
                  />
                  <span className="text-sm text-muted-foreground">
                    {rating > 0 ? `${rating} out of 5` : "Select a rating"}
                  </span>
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-3">
                <Label htmlFor="comment">Comment *</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this mess..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{comment.length}/1000 characters</span>
                  <span>Required</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="nav"
                  onClick={handleCloseReviewDialog}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                variant="nav"
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || !comment.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Load More Button */}
      {userReviewsPagination?.hasNext && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={userReviewsLoading}
            variant="nav"
          >
            {userReviewsLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Review;
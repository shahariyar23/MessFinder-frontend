import MessGallery from "@/components/Common/MessGallery ";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMessById } from "@/store/mess/messSlice";
import { sendMessViewRequest } from "@/store/mess/requestMessSlice";
import { checkMessSaved, saveMess, unsaveMess } from "@/store/mess/saveMessSlice";
import { Bookmark, BookmarkCheck, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const SingleMess = () => {
  const { messId } = useParams();
  const { currentMess, isLoading } = useSelector((state) => state.mess);
  const {loading, checkedMesses} = useSelector((state) => state.save);
  console.log(currentMess )
  const nevigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
   
      dispatch(getMessById(messId));
      dispatch(checkMessSaved(messId));
  }, []);
  // request for view mess
  const handleRequest = async () => {
  try {
    await dispatch(sendMessViewRequest({ messId, ownerId: currentMess?.owner_id?._id })).unwrap();
    toast.success("Request sent successfully! Owner will contact you.");
  } catch (error) {
    toast.error(`Failed to send request: ${error}`);
  }
};

// saved mass 
const handleBookmark = () => { 
    dispatch(saveMess(messId)).then(res=>{
      if(res?.payload?.success){
        toast.success(res?.payload?.message);
      }else{
        console.log(res);
        
        toast.error(res?.payload);
      };
    });
}
// unsave mess
const handelUnsaveBookmark = () =>{
        dispatch(unsaveMess(messId)).then(res=>{
      if(res?.payload?.success){
        toast.success(res?.payload?.message);
      }else{
        console.log(res);
        
        toast.error(res?.payload);
   }}) 
}

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="size-10 text-sky-500" />
      </div>
    );
  }

  if (!currentMess) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Mess Not Found
          </h2>
          <p className="text-gray-500">
            The mess you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // Rest of your component remains the same...
  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5 bg-[#f7f8fa] min-h-screen">
      <div className="layout-content-container flex flex-col max-w-[960px] w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex-1">
            <h1 className="text-[#0d171b] text-[32px] font-bold leading-tight mb-2">
              {currentMess?.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sky-500 font-medium">
                  {currentMess?.ratingInfo?.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-gray-500 text-sm">
                  ({currentMess?.ratingInfo?.totalReviews || 0} reviews)
                </span>
              </div>
              <span>•</span>
              <span className="capitalize">{currentMess?.roomType} Room</span>
              <span>•</span>
              <span className="capitalize">
                {currentMess?.genderPreference}
              </span>
              <Tooltip>
                <TooltipTrigger asChild  className="capitalize cursor-pointer" >
                  <div className="flex gap-2 items-center justify-center">
                    {
                      checkedMesses[messId] ? <Heart onClick={()=> handelUnsaveBookmark()} strokeWidth={1.5} className="text-red-500 " fill="currentColor"/> : <Bookmark onClick={() => handleBookmark()}/>
                    }
                    <Spinner className={`size-5 text-sky-500 ${loading ? 'block' : 'hidden'}`} />
                  </div>
                  
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    {checkedMesses[messId] ? "Saved" : "Save mess"}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[200px] mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Monthly Rent</p>
              <p className="text-2xl font-bold text-sky-500">
                ৳{currentMess?.payPerMonth}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Advance: {currentMess?.advancePaymentMonth} month(s)
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full bg-white p-4 rounded-lg mb-6 shadow-sm">
          <MessGallery images={currentMess?.image?.map((i) => i.url) || []} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-[#0d171b] text-[22px] font-bold mb-4">
                About {currentMess?.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {currentMess?.description}
              </p>
            </section>

            {/* Location Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-[#0d171b] text-[22px] font-bold mb-4">
                Location
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-700 font-medium mb-2">Address:</p>
                <p className="text-gray-600">{currentMess?.address}</p>
              </div>
              <div className="mt-4 bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-gray-500">Map View Coming Soon</p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-[#0d171b] text-[22px] font-bold mb-4">
                Owner Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="text-gray-800 font-medium">
                    {currentMess?.owner_id?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-gray-800 font-medium">
                    {currentMess?.owner_id?.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="text-sky-500 font-medium">
                    {currentMess?.owner_id?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Contact</p>
                  <p className="text-gray-800 font-medium">
                    {currentMess?.contact}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Key Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-[#0d171b] text-lg font-bold mb-4">
                Key Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in Date</span>
                  <span className="text-gray-800 font-medium">
                    {currentMess?.availableFrom
                      ? new Date(currentMess.availableFrom).toLocaleDateString()
                      : "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type</span>
                  <span className="text-gray-800 font-medium capitalize">
                    {currentMess?.roomType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender Preference</span>
                  <span className="text-gray-800 font-medium capitalize">
                    {currentMess?.genderPreference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`${currentMess?.status === "booked"
                    ? "bg-red-500"
                    : currentMess?.status === "in progress"
                    ? "bg-blue-500"
                    : currentMess?.status === "pending"
                    ? "text-yellow-500"
                    : "text-green-500"
                  } font-medium capitalize`}>
                    {currentMess?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Facilities Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-[#0d171b] text-lg font-bold mb-4">
                Facilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentMess?.facilities?.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Room Features Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-[#0d171b] text-lg font-bold mb-4">
                Room Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentMess?.roomFeatures?.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
              <Button className="w-full" variant="nav" onClick={()=> nevigate(`/mess/booking/${currentMess?._id}`)}>
                Book Now
              </Button>
              <Button
                className="w-full"
                variant="login"
                onClick={handleRequest}
              >
                Request to View Mess
              </Button>
            </div>
          </div>
        </div>

        {/* Review & Additional Information */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-[#0d171b] text-lg font-bold mb-6">
            Reviews & Additional Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Details */}
            <div>
              <h4 className="text-gray-700 font-medium mb-4">
                Payment Details
              </h4>
              <ul className="text-gray-600 space-y-3">
                <li className="flex justify-between">
                  <span>Monthly Rent:</span>
                  <span className="font-semibold">
                    ৳{currentMess?.payPerMonth}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Advance Payment:</span>
                  <span className="font-semibold">
                    {currentMess?.advancePaymentMonth} month(s)
                  </span>
                </li>
                <li className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total Advance:</span>
                  <span className="font-bold text-sky-600">
                    ৳
                    {currentMess?.payPerMonth *
                      currentMess?.advancePaymentMonth}
                  </span>
                </li>
              </ul>
            </div>

            {/* Middle Column - Quick Facts */}
            <div>
              <h4 className="text-gray-700 font-medium mb-4">Quick Facts</h4>
              <ul className="text-gray-600 space-y-3">
                <li className="flex justify-between">
                  <span>Listed on:</span>
                  <span className="font-medium">
                    {currentMess?.createdAt
                      ? new Date(currentMess.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Last updated:</span>
                  <span className="font-medium">
                    {currentMess?.updatedAt
                      ? new Date(currentMess.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Status:</span>
                  <span className={`${currentMess?.status === "booked"
                    ? "bg-red-500"
                    : currentMess?.status === "in progress"
                    ? "bg-blue-500"
                    : currentMess?.status === "pending"
                    ? "text-yellow-500"
                    : "text-green-500"
                  } font-medium capitalize`}>
                    {currentMess?.status}
                  </span>
                </li>
              </ul>
            </div>

            {/* Right Column - Review Information */}
            <div>
              <h4 className="text-gray-700 font-medium mb-4">
                Customer Reviews
              </h4>

              {/* Overall Rating */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-sky-600">
                    {currentMess?.ratingInfo?.averageRating?.toFixed(1) ||
                      "0.0"}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <=
                            Math.round(
                              currentMess?.ratingInfo?.averageRating || 0
                            )
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on {currentMess?.ratingInfo?.totalReviews || 0}{" "}
                      reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              {currentMess?.ratingInfo?.ratingDistribution &&
              currentMess.ratingInfo.totalReviews > 0 ? (
                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Rating Breakdown
                  </h5>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      currentMess.ratingInfo.ratingDistribution[rating] || 0;
                    const total = currentMess.ratingInfo.totalReviews || 1;
                    const percentage = (count / total) * 100;

                    return (
                      <div
                        key={rating}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-4 text-gray-600">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-gray-500 text-xs">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mb-4"></div>
              )}

              {/* Other People's Reviews */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  What Others Say
                </h5>

                {currentMess?.ratingInfo?.recentReviews &&
                currentMess.ratingInfo.recentReviews.length > 0 ? (
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                    {currentMess.ratingInfo.recentReviews.map(
                      (review, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-3 bg-white"
                        >
                          {/* Review Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                                <span className="text-sky-600 text-sm font-medium">
                                  {review.userName?.charAt(0)?.toUpperCase() ||
                                    "U"}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {review.userName || "Anonymous User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt
                                      ).toLocaleDateString()
                                    : "Recently"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                              <span className="text-yellow-600 text-sm font-medium">
                                {review.rating}
                              </span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          </div>

                          {/* Review Comment */}
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {review.comment}
                          </p>

                          {/* Review Helpful Section */}
                          {review.helpfulCount !== undefined && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                              <button className="text-xs text-gray-500 hover:text-sky-600 flex items-center gap-1">
                                <span>👍</span>
                                Helpful ({review.helpfulCount || 0})
                              </button>
                              <button className="text-xs text-gray-500 hover:text-sky-600">
                                Report
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  // Empty State when no reviews
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <div className="text-gray-500 text-sm mb-2">
                      No reviews yet
                    </div>
                    <div className="text-gray-400 text-xs">
                      Be the first to share your experience
                    </div>
                  </div>
                )}
              </div>

              {/* Review Stats - Only show if there are reviews */}
              {currentMess?.ratingInfo?.totalReviews > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-sky-600">
                      {currentMess.ratingInfo.totalReviews}
                    </div>
                    <div className="text-gray-500">Total Reviews</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">
                      {currentMess.ratingInfo.averageRating >= 4
                        ? "Excellent"
                        : currentMess.ratingInfo.averageRating >= 3
                        ? "Good"
                        : currentMess.ratingInfo.averageRating >= 2
                        ? "Average"
                        : "Poor"}
                    </div>
                    <div className="text-gray-500">Rating</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons for Reviews */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" className="flex-1" size="sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Write a Review
            </Button>
            {currentMess?.ratingInfo?.totalReviews > 0 && (
              <Button variant="outline" className="flex-1" size="sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                See All Reviews
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMess;

const ReviewListing = ({ reviews, isHistory }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          {/* Review card content */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{review.messName}</h3>
              <p className="text-sm text-gray-600">{review.bookingDate}</p>
            </div>
            {!isHistory && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Write Review
              </button>
            )}
          </div>
          {isHistory && (
            <div className="mt-2">
              <div className="flex items-center gap-1">
                {/* Star rating display */}
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewListing;
// store/mess/reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user reviews with pagination
export const getUserReviews = createAsyncThunk(
  'review/getUserReviews',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review/get-review-user`, {
        params: { page, limit },
        withCredentials: true  
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create new review
export const createReview = createAsyncThunk(
  'review/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/review/create-review`, reviewData,{
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update review
export const updateReview = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/review/update-review-id/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete review
export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review/delete-review-id/${reviewId}`);
      return { reviewId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get mess reviews with pagination and filters
export const getMessReviews = createAsyncThunk(
  'review/getMessReviews',
  async ({ messId, page = 1, limit = 10, rating, sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review/get-review-mess/${messId}`, {
        params: { page, limit, rating, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get review statistics for a mess
export const getMessReviewStats = createAsyncThunk(
  'review/getMessReviewStats',
  async (messId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/review/get-reviewstatuts-mess/${messId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    // User reviews
    userReviews: [],
    userReviewsLoading: false,
    userReviewsPagination: {
      currentPage: 1,
      totalPages: 0,
      totalReviews: 0,
      hasNext: false,
      hasPrev: false
    },
    
    // Mess reviews
    messReviews: [],
    messReviewsLoading: false,
    messReviewStats: null,
    messReviewsPagination: {
      currentPage: 1,
      totalPages: 0,
      totalReviews: 0,
      hasNext: false,
      hasPrev: false
    },
    messReviewsFilters: {
      rating: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    
    // Review management
    createReviewLoading: false,
    updateReviewLoading: false,
    deleteReviewLoading: false,
    
    // Separated reviews for tabs
    toBeReviewed: [],
    reviewedHistory: [],
    reviewCounts: {
      toBeReviewed: 0,
      history: 0
    },
    
    // Errors
    error: null
  },
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearMessReviews: (state) => {
      state.messReviews = [];
      state.messReviewStats = null;
      state.messReviewsPagination = {
        currentPage: 1,
        totalPages: 0,
        totalReviews: 0,
        hasNext: false,
        hasPrev: false
      };
    },
    setMessReviewsFilters: (state, action) => {
      state.messReviewsFilters = { ...state.messReviewsFilters, ...action.payload };
    },
    // Helper to separate reviews into toBeReviewed and reviewedHistory
    separateReviews: (state) => {
      // This would typically be based on your business logic
      // For example, toBeReviewed might be bookings that are completed but not reviewed
      // and reviewedHistory are actual reviews
      state.toBeReviewed = state.userReviews.filter(review => !review.isReviewed);
      state.reviewedHistory = state.userReviews.filter(review => review.isReviewed);
      state.reviewCounts.toBeReviewed = state.toBeReviewed.length;
      state.reviewCounts.history = state.reviewedHistory.length;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get User Reviews
      .addCase(getUserReviews.pending, (state) => {
        state.userReviewsLoading = true;
        state.error = null;
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
  state.userReviewsLoading = false;
  
  // Safely access the data with proper fallbacks
  const responseData = action.payload?.data || {};
  const bookings = responseData.bookings || [];
  const pagination = responseData.pagination || {};
  
  state.userReviews = bookings;
  state.userReviewsPagination = {
    currentPage: pagination.currentPage || 1,
    totalPages: pagination.totalPages || 0,
    totalReviews: pagination.totalBookings || 0,
    hasNext: pagination.hasNext || false,
    hasPrev: pagination.hasPrev || false
  };
  
  // Filter based on your actual API response structure
  state.toBeReviewed = bookings.filter(booking => 
    booking?.canReview === true
  );
  state.reviewedHistory = bookings.filter(booking => 
    booking?.hasReview === true
  );
  state.reviewCounts.toBeReviewed = state.toBeReviewed.length;
  state.reviewCounts.history = state.reviewedHistory.length;
})
      .addCase(getUserReviews.rejected, (state, action) => {
        state.userReviewsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.createReviewLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.createReviewLoading = false;
        state.userReviews.unshift(action.payload.data);
        state.reviewedHistory.unshift(action.payload.data);
        state.reviewCounts.history += 1;
        
        // Remove from toBeReviewed if it was there
        state.toBeReviewed = state.toBeReviewed.filter(
          item => item.booking_id !== action.payload.data.booking_id
        );
        state.reviewCounts.toBeReviewed = state.toBeReviewed.length;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createReviewLoading = false;
        state.error = action.payload?.message || 'Failed to create review';
      })
      
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.updateReviewLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.updateReviewLoading = false;
        const updatedReview = action.payload.data;
        
        // Update in userReviews
        const reviewIndex = state.userReviews.findIndex(
          review => review._id === updatedReview._id
        );
        if (reviewIndex !== -1) {
          state.userReviews[reviewIndex] = updatedReview;
        }
        
        // Update in reviewedHistory
        const historyIndex = state.reviewedHistory.findIndex(
          review => review._id === updatedReview._id
        );
        if (historyIndex !== -1) {
          state.reviewedHistory[historyIndex] = updatedReview;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.updateReviewLoading = false;
        state.error = action.payload?.message || 'Failed to update review';
      })
      
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.deleteReviewLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleteReviewLoading = false;
        const deletedReviewId = action.payload.reviewId;
        
        // Remove from all arrays
        state.userReviews = state.userReviews.filter(
          review => review._id !== deletedReviewId
        );
        state.reviewedHistory = state.reviewedHistory.filter(
          review => review._id !== deletedReviewId
        );
        state.reviewCounts.history = state.reviewedHistory.length;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleteReviewLoading = false;
        state.error = action.payload?.message || 'Failed to delete review';
      })
      
      // Get Mess Reviews
      .addCase(getMessReviews.pending, (state) => {
        state.messReviewsLoading = true;
        state.error = null;
      })
      .addCase(getMessReviews.fulfilled, (state, action) => {
        state.messReviewsLoading = false;
        state.messReviews = action.payload.data.reviews || [];
        state.messReviewsPagination = {
          currentPage: action.payload.data.pagination.currentPage,
          totalPages: action.payload.data.pagination.totalPages,
          totalReviews: action.payload.data.pagination.totalReviews,
          hasNext: action.payload.data.pagination.hasNext,
          hasPrev: action.payload.data.pagination.hasPrev
        };
      })
      .addCase(getMessReviews.rejected, (state, action) => {
        state.messReviewsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch mess reviews';
      })
      
      // Get Mess Review Stats
      .addCase(getMessReviewStats.fulfilled, (state, action) => {
        state.messReviewStats = action.payload.data;
      })
      .addCase(getMessReviewStats.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to fetch review statistics';
      });
  }
});

export const { 
  clearReviewError, 
  clearMessReviews, 
  setMessReviewsFilters,
  separateReviews 
} = reviewSlice.actions;

export default reviewSlice.reducer;
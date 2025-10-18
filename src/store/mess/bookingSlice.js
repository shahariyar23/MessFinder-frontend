import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/booking/create-booking",
        bookingData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status } = filters;
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await axios.get(
        `http://localhost:8000/api/v1/booking/get-user-booking?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user bookings"
      );
    }
  }
);

export const getOwnerBookings = createAsyncThunk(
  "booking/getOwnerBookings",
  async ({ ownerId, filters = {} }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status } = filters;
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await axios.get(
        `http://localhost:8000/api/v1/booking/get-owner-booking/${ownerId}?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch owner bookings"
      );
    }
  }
);

export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/booking/get-booking-info/${bookingId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking details"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "booking/updateBookingStatus",
  async ({ bookingId, bookingStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/booking/update-booking-status/${bookingId}`,
        { bookingStatus },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "booking/updatePaymentStatus",
  async ({ bookingId, paymentStatus, transactionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/booking/update-booking-payment-status/${bookingId}`,
        { paymentStatus, transactionId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update payment status"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/booking/cancel-booking/${bookingId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/booking/delete-booking/${bookingId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete booking"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    // Create Booking States
    createLoading: false,
    createSuccess: false,
    createError: null,
    
    // User Bookings States
    userBookings: [],
    userBookingsLoading: false,
    userBookingsError: null,
    
    // Owner Bookings States
    ownerBookings: [],
    ownerBookingsLoading: false,
    ownerBookingsError: null,
    
    // Current Booking Details
    currentBooking: null,
    bookingDetailsLoading: false,
    bookingDetailsError: null,
    
    // Update States
    updateStatusLoading: false,
    updateStatusError: null,
    updatePaymentLoading: false,
    updatePaymentError: null,
    
    // Pagination
    userPagination: {
      currentPage: 1,
      totalPages: 0,
      totalBookings: 0,
      hasNext: false,
      hasPrev: false,
      limit: 10
    },
    ownerPagination: {
      currentPage: 1,
      totalPages: 0,
      totalBookings: 0,
      hasNext: false,
      hasPrev: false,
      limit: 10
    }
  },
  reducers: {
    clearBookingState: (state) => {
      state.createLoading = false;
      state.createSuccess = false;
      state.createError = null;
      state.userBookingsError = null;
      state.ownerBookingsError = null;
      state.bookingDetailsError = null;
      state.updateStatusError = null;
      state.updatePaymentError = null;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearUserBookings: (state) => {
      state.userBookings = [];
      state.userPagination = {
        currentPage: 1,
        totalPages: 0,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false,
        limit: 10
      };
    },
    clearOwnerBookings: (state) => {
      state.ownerBookings = [];
      state.ownerPagination = {
        currentPage: 1,
        totalPages: 0,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false,
        limit: 10
      };
    },
    updateBookingInList: (state, action) => {
      const { bookingId, updates } = action.payload;
      
      // Update in user bookings
      const userIndex = state.userBookings.findIndex(
        booking => booking._id === bookingId || booking.id === bookingId
      );
      if (userIndex !== -1) {
        state.userBookings[userIndex] = { ...state.userBookings[userIndex], ...updates };
      }
      
      // Update in owner bookings
      const ownerIndex = state.ownerBookings.findIndex(
        booking => booking._id === bookingId || booking.id === bookingId
      );
      if (ownerIndex !== -1) {
        state.ownerBookings[ownerIndex] = { ...state.ownerBookings[ownerIndex], ...updates };
      }
      
      // Update current booking if it matches
      if (state.currentBooking && (state.currentBooking._id === bookingId || state.currentBooking.id === bookingId)) {
        state.currentBooking = { ...state.currentBooking, ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
        state.createError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.createError = null;
        
        // Add to user bookings list
        const newBooking = action.payload.data || action.payload;
        if (newBooking) {
          state.userBookings.unshift(newBooking);
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createLoading = false;
        state.createSuccess = false;
        state.createError = action.payload;
      })

      // Get User Bookings
      .addCase(getUserBookings.pending, (state) => {
        state.userBookingsLoading = true;
        state.userBookingsError = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.userBookingsLoading = false;
        state.userBookingsError = null;
        state.userBookings = action.payload.data?.bookings || action.payload.bookings || [];
        
        if (action.payload.data?.pagination) {
          state.userPagination = action.payload.data.pagination;
        } else if (action.payload.pagination) {
          state.userPagination = action.payload.pagination;
        }
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.userBookingsLoading = false;
        state.userBookingsError = action.payload;
        state.userBookings = [];
      })

      // Get Owner Bookings
      .addCase(getOwnerBookings.pending, (state) => {
        state.ownerBookingsLoading = true;
        state.ownerBookingsError = null;
      })
      .addCase(getOwnerBookings.fulfilled, (state, action) => {
        state.ownerBookingsLoading = false;
        state.ownerBookingsError = null;
        state.ownerBookings = action.payload.data?.bookings || action.payload.bookings || [];
        
        if (action.payload.data?.pagination) {
          state.ownerPagination = action.payload.data.pagination;
        } else if (action.payload.pagination) {
          state.ownerPagination = action.payload.pagination;
        }
      })
      .addCase(getOwnerBookings.rejected, (state, action) => {
        state.ownerBookingsLoading = false;
        state.ownerBookingsError = action.payload;
        state.ownerBookings = [];
      })

      // Get Booking By ID
      .addCase(getBookingById.pending, (state) => {
        state.bookingDetailsLoading = true;
        state.bookingDetailsError = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.bookingDetailsLoading = false;
        state.bookingDetailsError = null;
        state.currentBooking = action.payload.data || action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.bookingDetailsLoading = false;
        state.bookingDetailsError = action.payload;
        state.currentBooking = null;
      })

      // Update Booking Status
      .addCase(updateBookingStatus.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = null;
        
        const updatedBooking = action.payload.data || action.payload;
        if (updatedBooking) {
          const bookingId = updatedBooking._id || updatedBooking.id;
          
          // Update in lists
          state.userBookings = state.userBookings.map(booking =>
            (booking._id === bookingId || booking.id === bookingId) ? updatedBooking : booking
          );
          state.ownerBookings = state.ownerBookings.map(booking =>
            (booking._id === bookingId || booking.id === bookingId) ? updatedBooking : booking
          );
          
          // Update current booking
          if (state.currentBooking && (state.currentBooking._id === bookingId || state.currentBooking.id === bookingId)) {
            state.currentBooking = updatedBooking;
          }
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload;
      })

      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.updatePaymentLoading = true;
        state.updatePaymentError = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.updatePaymentLoading = false;
        state.updatePaymentError = null;
        
        const updatedBooking = action.payload.data || action.payload;
        if (updatedBooking) {
          const bookingId = updatedBooking._id || updatedBooking.id;
          
          // Update in lists
          state.userBookings = state.userBookings.map(booking =>
            (booking._id === bookingId || booking.id === bookingId) ? updatedBooking : booking
          );
          state.ownerBookings = state.ownerBookings.map(booking =>
            (booking._id === bookingId || booking.id === bookingId) ? updatedBooking : booking
          );
          
          // Update current booking
          if (state.currentBooking && (state.currentBooking._id === bookingId || state.currentBooking.id === bookingId)) {
            state.currentBooking = updatedBooking;
          }
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.updatePaymentLoading = false;
        state.updatePaymentError = action.payload;
      })

      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = null;
        
        const cancelledBooking = action.payload.data || action.payload;
        if (cancelledBooking) {
          const bookingId = cancelledBooking._id || cancelledBooking.id;
          
          // Update in lists
          state.userBookings = state.userBookings.map(booking =>
            (booking._id === bookingId || booking.id === bookingId) ? cancelledBooking : booking
          );
          state.ownerBookings = state.ownerBookings.map(booking =>
            (booking._id === bookingId || booking.id === bookingId) ? cancelledBooking : booking
          );
          
          // Update current booking
          if (state.currentBooking && (state.currentBooking._id === bookingId || state.currentBooking.id === bookingId)) {
            state.currentBooking = cancelledBooking;
          }
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload;
      })

      // Delete Booking
      .addCase(deleteBooking.fulfilled, (state, action) => {
        const bookingId = action.meta.arg;
        
        // Remove from lists
        state.userBookings = state.userBookings.filter(
          booking => booking._id !== bookingId && booking.id !== bookingId
        );
        state.ownerBookings = state.ownerBookings.filter(
          booking => booking._id !== bookingId && booking.id !== bookingId
        );
        
        // Clear current booking if it's the deleted one
        if (state.currentBooking && (state.currentBooking._id === bookingId || state.currentBooking.id === bookingId)) {
          state.currentBooking = null;
        }
      });
  }
});

export const {
  clearBookingState,
  resetCreateSuccess,
  clearCurrentBooking,
  clearUserBookings,
  clearOwnerBookings,
  updateBookingInList
} = bookingSlice.actions;

export default bookingSlice.reducer;
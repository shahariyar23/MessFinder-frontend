// src/redux/slices/adminBookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

// Async thunks
export const getAllBookingsAdmin = createAsyncThunk(
  'adminBookings/getAllBookingsAdmin',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      }).toString();

      const response = await axios.get(`${api}/admin/booking/all?${queryParams}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBookingStatistics = createAsyncThunk(
  'adminBookings/getBookingStatistics',
  async ({ period = 'month' } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/admin/booking/statistics?period=${period}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const adminUpdateBookingStatus = createAsyncThunk(
  'adminBookings/adminUpdateBookingStatus',
  async ({ bookingId, bookingStatus, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${api}/admin/booking/${bookingId}/status`,
        { bookingStatus, adminNotes },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const adminUpdatePaymentStatus = createAsyncThunk(
  'adminBookings/adminUpdatePaymentStatus',
  async ({ bookingId, paymentStatus, transactionId, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${api}/admin/booking/${bookingId}/payment-status`,
        { paymentStatus, transactionId, adminNotes },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const adminRefundBooking = createAsyncThunk(
  'adminBookings/adminRefundBooking',
  async ({ bookingId, refundAmount, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${api}/admin/booking/${bookingId}/refund`,
        { refundAmount, reason },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const adminGetBookingById = createAsyncThunk(
  'adminBookings/adminGetBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/admin/booking/${bookingId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const adminDeleteBooking = createAsyncThunk(
  'adminBookings/adminDeleteBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api}/admin/booking/${bookingId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  bookings: [],
  statistics: {
    statusCounts: {},
    paymentStatusCounts: {},
    revenue: {
      totalRevenue: 0,
      totalBookings: 0,
      averageAmount: 0
    },
    monthlyTrends: [],
    totalBookings: 0
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false
  },
  filters: {},
  loading: false,
  actionLoading: false,
  error: null,
  statsLoading: false,
  statsError: null,
  currentBooking: null
};

const adminBookingSlice = createSlice({
  name: 'adminBookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.statsError = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    resetBookings: (state) => {
      state.bookings = [];
      state.statistics = initialState.statistics;
      state.pagination = initialState.pagination;
      state.filters = {};
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all bookings admin
      .addCase(getAllBookingsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookingsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data.bookings || [];
        state.statistics = action.payload.data.statistics || initialState.statistics;
        state.pagination = action.payload.data.pagination || initialState.pagination;
        state.filters = action.payload.data.filters || {};
      })
      .addCase(getAllBookingsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bookings';
      })
      // Get booking statistics
      .addCase(getBookingStatistics.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(getBookingStatistics.fulfilled, (state, action) => {
        state.statsLoading = false;
        // Store additional stats if needed
      })
      .addCase(getBookingStatistics.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload?.message || 'Failed to fetch booking statistics';
      })
      // Update booking status
      .addCase(adminUpdateBookingStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateBookingStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updatedBooking = action.payload.data;
        const index = state.bookings.findIndex(booking => booking._id === updatedBooking._id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.currentBooking && state.currentBooking._id === updatedBooking._id) {
          state.currentBooking = updatedBooking;
        }
      })
      .addCase(adminUpdateBookingStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Failed to update booking status';
      })
      // Update payment status
      .addCase(adminUpdatePaymentStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(adminUpdatePaymentStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updatedBooking = action.payload.data;
        const index = state.bookings.findIndex(booking => booking._id === updatedBooking._id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        if (state.currentBooking && state.currentBooking._id === updatedBooking._id) {
          state.currentBooking = updatedBooking;
        }
      })
      .addCase(adminUpdatePaymentStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Failed to update payment status';
      })
      // Refund booking
      .addCase(adminRefundBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(adminRefundBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        const refundedBooking = action.payload.data;
        const index = state.bookings.findIndex(booking => booking._id === refundedBooking.bookingId);
        if (index !== -1) {
          state.bookings[index].paymentStatus = 'refunded';
          state.bookings[index].refundAmount = refundedBooking.refundAmount;
          state.bookings[index].refundReason = refundedBooking.reason;
          state.bookings[index].refundedAt = new Date().toISOString();
        }
      })
      .addCase(adminRefundBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Failed to process refund';
      })
      // Get booking by ID
      .addCase(adminGetBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminGetBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data;
      })
      .addCase(adminGetBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch booking details';
      })
      // Delete booking
      .addCase(adminDeleteBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(adminDeleteBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove deleted booking from list
        state.bookings = state.bookings.filter(booking => booking._id !== action.meta.arg);
        state.currentBooking = null;
      })
      .addCase(adminDeleteBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Failed to delete booking';
      });
  }
});

// Selectors
export const selectAdminBookings = (state) => state.adminBooking.bookings;
export const selectAdminBookingStatistics = (state) => state.adminBooking.statistics;
export const selectAdminBookingPagination = (state) => state.adminBooking.pagination;
export const selectAdminBookingFilters = (state) => state.adminBooking.filters;
export const selectAdminBookingsLoading = (state) => state.adminBooking.loading;
export const selectAdminBookingActionLoading = (state) => state.adminBooking.actionLoading;
export const selectAdminBookingsError = (state) => state.adminBooking.error;
export const selectAdminBookingStatsLoading = (state) => state.adminBooking.statsLoading;
export const selectAdminBookingStatsError = (state) => state.adminBooking.statsError;
export const selectCurrentAdminBooking = (state) => state.adminBooking.currentBooking;

// Export actions and reducer
export const { 
  clearError, 
  setFilters, 
  clearFilters, 
  resetBookings,
  clearCurrentBooking 
} = adminBookingSlice.actions;
export default adminBookingSlice.reducer;
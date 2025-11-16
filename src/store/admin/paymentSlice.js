import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

// Async thunks
export const getAllPaymentsAdmin = createAsyncThunk(
  'payments/getAllPaymentsAdmin',
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      }).toString();

      const response = await axios.get(`${api}/admin/payment/all?${queryParams}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPaymentStatistics = createAsyncThunk(
  'payments/getPaymentStatistics',
  async ({ period = 'month' } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/admin/payment/statistics?period=${period}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'payments/updatePaymentStatus',
  async ({ bookingId, paymentStatus, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${api}/admin/payment/${bookingId}/status`,
        { paymentStatus, adminNotes },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async ({ bookingId, refundAmount, reason }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${api}/admin/payment/${bookingId}/refund`,
        { refundAmount, reason },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state based on your API response
const initialState = {
  payments: [],
  statistics: {
    statusCounts: {},
    methodDistribution: {},
    revenue: {
      totalRevenue: 0,
      totalBookings: 0,
      averageAmount: 0
    },
    totalPayments: 0
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    hasNext: false,
    hasPrev: false
  },
  filters: {},
  loading: false,
  actionLoading: false,
  error: null,
  statsLoading: false,
  statsError: null
};

const paymentSlice = createSlice({
  name: 'payments',
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
    resetPayments: (state) => {
      state.payments = [];
      state.statistics = initialState.statistics;
      state.pagination = initialState.pagination;
      state.filters = {};
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all payments admin
      .addCase(getAllPaymentsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPaymentsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data.payments || [];
        state.statistics = action.payload.data.statistics || initialState.statistics;
        state.pagination = action.payload.data.pagination || initialState.pagination;
        state.filters = action.payload.data.filters || {};
      })
      .addCase(getAllPaymentsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch payments';
      })
      // Get payment statistics
      .addCase(getPaymentStatistics.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(getPaymentStatistics.fulfilled, (state, action) => {
        state.statsLoading = false;
      })
      .addCase(getPaymentStatistics.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload?.message || 'Failed to fetch payment statistics';
      })
      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update the specific payment in the list
        const updatedPayment = action.payload.data;
        const index = state.payments.findIndex(payment => payment._id === updatedPayment._id);
        if (index !== -1) {
          state.payments[index] = updatedPayment;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Failed to update payment status';
      })
      // Refund payment
      .addCase(refundPayment.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(refundPayment.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update the specific payment in the list
        const refundedPayment = action.payload.data;
        const index = state.payments.findIndex(payment => payment._id === refundedPayment.bookingId);
        if (index !== -1) {
          state.payments[index].paymentStatus = 'refunded';
          state.payments[index].refundAmount = refundedPayment.refundAmount;
          state.payments[index].refundReason = refundedPayment.reason;
          state.payments[index].refundedAt = new Date().toISOString();
        }
      })
      .addCase(refundPayment.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Failed to process refund';
      });
  }
});

// Selectors
export const selectPayments = (state) => state.adminPayment.payments;
export const selectPaymentStatistics = (state) => state.adminPayment.statistics;
export const selectPaymentPagination = (state) => state.adminPayment.pagination;
export const selectPaymentFilters = (state) => state.adminPayment.filters;
export const selectPaymentsLoading = (state) => state.adminPayment.loading;
export const selectActionLoading = (state) => state.adminPayment.actionLoading;
export const selectPaymentsError = (state) => state.adminPayment.error;
export const selectStatsLoading = (state) => state.adminPayment.statsLoading;
export const selectStatsError = (state) => state.adminPayment.statsError;

// Export actions and reducer
export const { clearError, setFilters, clearFilters, resetPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get all messes by owner ID
export const getMessesByOwnerId = createAsyncThunk(
  "ownerMess/getMessesByOwnerId",
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/owner/get-all-messes/${ownerId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch owner messes",
        }
      );
    }
  }
);

// Update mess by ID (for owner)
export const updateMess = createAsyncThunk(
  "ownerMess/updateMess",
  async ({ messId, updateData }, { rejectWithValue }) => {
    console.log(messId, updateData);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/mess/update-mess/${messId}`,
        updateData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to update mess",
        }
      );
    }
  }
);

// Delete mess by ID
export const deleteMess = createAsyncThunk(
  "ownerMess/deleteMess",
  async (messId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/mess/delete/${messId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete mess",
        }
      );
    }
  }
);

// Get mess statistics for owner
export const getOwnerMessStats = createAsyncThunk(
  "ownerMess/getOwnerMessStats",
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/mess/owner/${ownerId}/stats`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch mess statistics",
        }
      );
    }
  }
);

// Update mess status (free, booked, in progress)
export const updateMessStatus = createAsyncThunk(
  "ownerMess/updateMessStatus",
  async ({ messId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/owner/get-all-messes/${ownerId}`,
        { status },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to update mess status",
        }
      );
    }
  }
);

// Get booking requests for owner's messes
export const getBookingRequests = createAsyncThunk(
  "ownerMess/getBookingRequests",
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/bookings/owner/${ownerId}/requests`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch booking requests",
        }
      );
    }
  }
);

const ownerMessSlice = createSlice({
  name: "ownerMess",
  initialState: {
    // Owner's messes data
    ownerMesses: [],
    currentOwnerMess: null,

    // Statistics
    stats: {
      totalMesses: 0,
      freeMesses: 0,
      bookedMesses: 0,
      inProgressMesses: 0,
      totalViews: 0,
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
    },

    // Booking requests
    bookingRequests: [],

    // Loading states
    isLoading: false,
    isStatsLoading: false,
    isUpdating: false,
    isDeleting: false,

    // Error handling
    error: null,
    statsError: null,
    updateError: null,
    deleteError: null,
  },
  reducers: {
    // Clear owner messes
    clearOwnerMesses: (state) => {
      state.ownerMesses = [];
      state.stats = {
        totalMesses: 0,
        freeMesses: 0,
        bookedMesses: 0,
        inProgressMesses: 0,
        totalViews: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
      };
    },

    // Update local mess status (optimistic update)
    updateLocalMessStatus: (state, action) => {
      const { messId, status } = action.payload;
      const mess = state.ownerMesses.find((mess) => mess._id === messId);
      if (mess) {
        mess.status = status;

        // Update stats locally
        if (status === "free") {
          state.stats.freeMesses += 1;
          state.stats.bookedMesses -= 1;
        } else if (status === "booked") {
          state.stats.bookedMesses += 1;
          state.stats.freeMesses -= 1;
        }
      }
    },

    // Remove mess locally after deletion
    removeLocalMess: (state, action) => {
      const messId = action.payload;
      state.ownerMesses = state.ownerMesses.filter(
        (mess) => mess._id !== messId
      );

      // Update stats
      const removedMess = state.ownerMesses.find((mess) => mess._id === messId);
      if (removedMess) {
        state.stats.totalMesses -= 1;
        state.stats.totalViews -= removedMess.view || 0;

        if (removedMess.status === "free") {
          state.stats.freeMesses -= 1;
        } else if (removedMess.status === "booked") {
          state.stats.bookedMesses -= 1;
        } else if (removedMess.status === "in progress") {
          state.stats.inProgressMesses -= 1;
        }
      }
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.statsError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Messes by Owner ID
      .addCase(getMessesByOwnerId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessesByOwnerId.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        if (action.payload.success) {
          state.ownerMesses = action.payload.data.messes || [];

          // Calculate initial stats from messes
          const stats = calculateStatsFromMesses(state.ownerMesses);
          state.stats = { ...state.stats, ...stats };
        }
      })
      .addCase(getMessesByOwnerId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch owner messes";
      })

      // Update Mess
      .addCase(updateMess.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateMess.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload.success) {
          // Fix: The structure might be different - check the actual response
          const updatedMess = action.payload.data?.mess || action.payload.data;

          console.log("Updated mess received:", updatedMess);

          if (updatedMess && updatedMess._id) {
            const index = state.ownerMesses.findIndex(
              (mess) => mess._id === updatedMess._id
            );
            if (index !== -1) {
              state.ownerMesses[index] = updatedMess;
            }
          } else {
            console.error("Updated mess data is invalid:", updatedMess);
          }
        }
      })
      .addCase(updateMess.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload?.message || "Failed to update mess";
      })

      // Delete Mess
      .addCase(deleteMess.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteMess.fulfilled, (state, action) => {
        state.isDeleting = false;
      })
      .addCase(deleteMess.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload?.message || "Failed to delete mess";
      })

      // Get Owner Mess Stats
      .addCase(getOwnerMessStats.pending, (state) => {
        state.isStatsLoading = true;
        state.statsError = null;
      })
      .addCase(getOwnerMessStats.fulfilled, (state, action) => {
        state.isStatsLoading = false;
        if (action.payload.success) {
          state.stats = { ...state.stats, ...action.payload.data.stats };
        }
      })
      .addCase(getOwnerMessStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.statsError =
          action.payload?.message || "Failed to fetch statistics";
      })

      // Update Mess Status
      .addCase(updateMessStatus.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateMessStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload.success) {
          const { messId, status } = action.payload.data;
          const mess = state.ownerMesses.find((mess) => mess._id === messId);
          if (mess) {
            mess.status = status;

            // Update stats
            const stats = calculateStatsFromMesses(state.ownerMesses);
            state.stats = { ...state.stats, ...stats };
          }
        }
      })
      .addCase(updateMessStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError =
          action.payload?.message || "Failed to update mess status";
      })

      // Get Booking Requests
      .addCase(getBookingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.bookingRequests = action.payload.data.bookingRequests || [];
        }
      })
      .addCase(getBookingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch booking requests";
      });
  },
});

// Helper function to calculate stats from messes array
const calculateStatsFromMesses = (messes) => {
  const totalMesses = messes.length;
  const freeMesses = messes.filter((mess) => mess.status === "free").length;
  const bookedMesses = messes.filter((mess) => mess.status === "booked").length;
  const inProgressMesses = messes.filter(
    (mess) => mess.status === "in progress"
  ).length;
  const totalViews = messes.reduce((sum, mess) => sum + (mess.view || 0), 0);
  const totalRevenue = messes.reduce((sum, mess) => {
    if (mess.status === "booked") {
      return sum + (mess.payPerMonth || 0);
    }
    return sum;
  }, 0);

  // Calculate average rating
  const ratings = messes
    .filter((mess) => mess.ratingInfo?.averageRating)
    .map((mess) => mess.ratingInfo.averageRating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

  return {
    totalMesses,
    freeMesses,
    bookedMesses,
    inProgressMesses,
    totalViews,
    totalBookings: bookedMesses, // Assuming each booked mess has one booking
    totalRevenue,
    averageRating: Math.round(averageRating * 10) / 10,
  };
};

export const {
  clearOwnerMesses,
  updateLocalMessStatus,
  removeLocalMess,
  clearErrors,
} = ownerMessSlice.actions;

export default ownerMessSlice.reducer;

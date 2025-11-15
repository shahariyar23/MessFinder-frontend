import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks
export const deleteMess = createAsyncThunk(
  "adminMess/deleteMess",
  async ({ messId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/delete-mess/${messId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete mess"
      );
    }
  }
);

export const updateMess = createAsyncThunk(
  "adminMess/updateMess",
  async ({ messId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update-mess/${messId}`,
        { updateData },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update mess"
      );
    }
  }
);

export const getAdminMessList = createAsyncThunk(
  "adminMess/getAdminMessList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await messListingService.getAdminMessList();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch mess list"
      );
    }
  }
);

export const getAllMesses = createAsyncThunk(
  "adminMess/getAllMesses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/get-all-mess`,
        {
          params,
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Slice
const adminMessSlice = createSlice({
  name: "adminMess",
  initialState: {
    messList: [], // For getAdminMessList
    messes: [],   // For getAllMesses
    loading: false,
    isLoading: false, // Specific for getAllMesses
    error: null,
    success: false,
    operation: null, // 'delete', 'update', 'fetch'
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalMesses: 0,
      hasNext: false,
      hasPrev: false,
    },
    filters: {
      status: 'all',
      minRating: null,
      maxRating: null
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetOperation: (state) => {
      state.operation = null;
    },
    clearAllMesses: (state) => {
      state.messes = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalMesses: 0,
        hasNext: false,
        hasPrev: false,
      };
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Delete Mess
      .addCase(deleteMess.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = "delete";
      })
      .addCase(deleteMess.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        // Remove deleted mess from both lists
        state.messList = state.messList.filter(
          (mess) => mess._id !== action.meta.arg.messId
        );
        state.messes = state.messes.filter(
          (mess) => mess._id !== action.meta.arg.messId
        );
      })
      .addCase(deleteMess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.operation = null;
      })
      // Update Mess
      .addCase(updateMess.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.operation = "update";
      })
      .addCase(updateMess.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.operation = null;
        // Update the mess in both lists
        const updatedMess = action.payload.data;
        if (updatedMess && updatedMess._id) {
          // Update in messList
          const messListIndex = state.messList.findIndex(
            (mess) => mess._id === updatedMess._id
          );
          if (messListIndex !== -1) {
            state.messList[messListIndex] = updatedMess;
          }
          
          // Update in messes
          const messesIndex = state.messes.findIndex(
            (mess) => mess._id === updatedMess._id
          );
          if (messesIndex !== -1) {
            state.messes[messesIndex] = updatedMess;
          }
        }
      })
      .addCase(updateMess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.operation = null;
      })
      // Get Admin Mess List
      .addCase(getAdminMessList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.operation = "fetch";
      })
      .addCase(getAdminMessList.fulfilled, (state, action) => {
        state.loading = false;
        state.messList = action.payload.data || [];
        state.operation = null;
      })
      .addCase(getAdminMessList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operation = null;
      })
      // Get All Messes
      .addCase(getAllMesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.operation = "fetch-all";
      })
      .addCase(getAllMesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.operation = null;
        
        if (action.payload.success) {
          state.messes = action.payload.data.messes || [];
          state.pagination = action.payload.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalMesses: 0,
            hasNext: false,
            hasPrev: false,
          };
          state.filters = action.payload.data.filters || state.filters;
        }
      })
      .addCase(getAllMesses.rejected, (state, action) => {
        state.isLoading = false;
        state.operation = null;
        state.error = action.payload?.message || "Failed to fetch messes";
      });
  },
});

// Export actions
export const { 
  clearError, 
  clearSuccess, 
  resetOperation, 
  clearAllMesses, 
  updateFilters 
} = adminMessSlice.actions;

// Export selectors
export const selectAdminMessList = (state) => state.adminMess.messList;
export const selectAllMesses = (state) => state.adminMess.messes;
export const selectAdminMessLoading = (state) => state.adminMess.loading;
export const selectAllMessesLoading = (state) => state.adminMess.isLoading;
export const selectAdminMessError = (state) => state.adminMess.error;
export const selectAdminMessSuccess = (state) => state.adminMess.success;
export const selectAdminMessOperation = (state) => state.adminMess.operation;
export const selectMessPagination = (state) => state.adminMess.pagination;
export const selectMessFilters = (state) => state.adminMess.filters;

export default adminMessSlice.reducer;
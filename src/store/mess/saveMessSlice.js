// store/savedMess/savedMessSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const saveMess = createAsyncThunk(
  "savedMess/saveMess",
  async (messId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/mess/save/add/${messId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save mess"
      );
    }
  }
);

export const unsaveMess = createAsyncThunk(
  "savedMess/unsaveMess",
  async (messId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/mess/save/delete/${messId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unsave mess"
      );
    }
  }
);

export const getSavedMesses = createAsyncThunk(
  "savedMess/getSavedMesses",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10 } = filters;
      const response = await axios.get(
        `http://localhost:8000/api/v1/mess/save/get-all?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch saved messes"
      );
    }
  }
);

export const checkMessSaved = createAsyncThunk(
  "savedMess/checkMessSaved",
  async (messId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/mess/save/check/${messId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check saved status"
      );
    }
  }
);

const savedMessSlice = createSlice({
  name: "savedMess",
  initialState: {
    savedMesses: [],
    loading: false,
    error: null,
    success: false,
    checkLoading: false,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalSaved: 0,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false
    },
    checkedMesses: {}
  },
  reducers: {
    clearSavedMessState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.checkLoading = false;
    },
    clearSavedMesses: (state) => {
      state.savedMesses = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalSaved: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      };
    },
    updateSavedMessInList: (state, action) => {
      const { messId, updates } = action.payload;
      const index = state.savedMesses.findIndex(
        item => item.mess?._id === messId || item.mess?.id === messId
      );
      if (index !== -1) {
        state.savedMesses[index] = { ...state.savedMesses[index], ...updates };
      }
    },
    // Optional: Set checked status for a mess
    setMessSavedStatus: (state, action) => {
      const { messId, isSaved } = action.payload;
      state.checkedMesses[messId] = isSaved;
    }
  },
  extraReducers: (builder) => {
    builder
      // Save Mess
      .addCase(saveMess.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(saveMess.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        
        // Update checked status
        const savedMess = action.payload.data?.savedMess;
        if (savedMess && savedMess.messId) {
          state.checkedMesses[savedMess.messId] = true;
        }
        
        
      })
      .addCase(saveMess.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Unsave Mess
      .addCase(unsaveMess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsaveMess.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Remove from saved messes list
        const messId = action.meta.arg;
        state.savedMesses = state.savedMesses.filter(
          item => item.mess?._id !== messId && item.mess?.id !== messId
        );
        
        // Update checked status
        state.checkedMesses[messId] = false;
        
        // Update pagination count
        if (state.pagination.totalSaved > 0) {
          state.pagination.totalSaved -= 1;
          state.pagination.totalPages = Math.ceil(state.pagination.totalSaved / state.pagination.limit);
        }
      })
      .addCase(unsaveMess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Saved Messes
      .addCase(getSavedMesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedMesses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.savedMesses = action.payload.data?.savedMesses || action.payload.savedMesses || [];
        // Update pagination
        if (action.payload.data?.pagination) {
          state.pagination = { ...state.pagination, ...action.payload.data.pagination };
        } else if (action.payload.pagination) {
          state.pagination = { ...state.pagination, ...action.payload.pagination };
        }
        
        // Update checked status for all fetched messes
        state.savedMesses.forEach(item => {
          if (item.mess) {
            const messId = item.mess._id || item.mess.id;
            state.checkedMesses[messId] = true;
          }
        });
      })
      .addCase(getSavedMesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.savedMesses = [];
      })

      // Check Mess Saved
      .addCase(checkMessSaved.pending, (state) => {
        state.checkLoading = true;
      })
      .addCase(checkMessSaved.fulfilled, (state, action) => {
        state.checkLoading = false;
        const { isSaved } = action.payload.data || action.payload;
        const messId = action.meta.arg;
        state.checkedMesses[messId] = isSaved;
      })
      .addCase(checkMessSaved.rejected, (state, action) => {
        state.checkLoading = false;
        console.error("Failed to check saved status:", action.payload);
      });
  }
});

export const { 
  clearSavedMessState, 
  clearSavedMesses, 
  updateSavedMessInList,
  setMessSavedStatus 
} = savedMessSlice.actions;

export default savedMessSlice.reducer;
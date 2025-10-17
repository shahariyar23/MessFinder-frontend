import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add New Mess with FormData
export const addMess = createAsyncThunk(
  "mess/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/mess/add",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      return response.data;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { 
          success: false, 
          message: "Something went wrong while adding mess" 
        }
      );
    }
  }
);

// Get All Messes (Simple search)
export const getAllMesses = createAsyncThunk(
  "mess/getAllMesses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/mess/get-all-mess",
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

// Get Single Mess by ID
export const getMessById = createAsyncThunk(
  "mess/getMessById",
  async (messId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/mess/get-mess-info/${messId}`,
        {
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

export const advancedSearchMesses = createAsyncThunk(
  "mess/advancedSearch",
  async (searchParams, { rejectWithValue }) => {
    try {
      // Remove empty parameters
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => 
          value !== "" && value !== null && value !== undefined
        )
      );

      const response = await axios.get(
        "http://localhost:8000/api/v1/mess/get-mess-search-with-sort",
        {
          params: cleanParams,
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { 
          success: false, 
          message: "Something went wrong while searching messes" 
        }
      );
    }
  }
);



const messSlice = createSlice({
  name: "mess",
  initialState: {
    // Mess data
    messes: [],
    currentMess: null,
    
    // Add Mess state
    addMessLoading: false,
    addMessError: null,
    addMessSuccess: false,
    newlyAddedMess: null,

    // Search and pagination
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalMesses: 0,
      hasNext: false,
      hasPrev: false,
    },
    
    filters: {
      search: "",
      budget: "",
      gender: "",
      roomType: "",
      wifi: "",
      laundry: "",
      location: "",
      sortBy: "price",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    },
    
    // Loading states
    isLoading: false,
    isSearchLoading: false,
    
    // Error handling
    error: null,
    searchError: null,
  },
  reducers: {
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        search: "",
        budget: "",
        gender: "",
        roomType: "",
        wifi: "",
        laundry: "",
        location: "",
        sortBy: "price",
        sortOrder: "desc",
        page: 1,
        limit: 10,
      };
    },
    
    // Reset search results
    clearSearchResults: (state) => {
      state.messes = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalMesses: 0,
        hasNext: false,
        hasPrev: false,
      };
    },
    
    // Set current page
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
    },
    
    // Reset add mess state
    resetAddMessState: (state) => {
      state.addMessLoading = false;
      state.addMessError = null;
      state.addMessSuccess = false;
      state.newlyAddedMess = null;
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.addMessError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Mess cases
      .addCase(addMess.pending, (state) => {
        state.addMessLoading = true;
        state.addMessError = null;
        state.addMessSuccess = false;
      })
      .addCase(addMess.fulfilled, (state, action) => {
        state.addMessLoading = false;
        if (action.payload.success) {
          state.addMessSuccess = true;
          state.newlyAddedMess = action.payload.data.mess;
        } else {
          state.addMessError = action.payload.message || "Failed to add mess";
        }
      })
      .addCase(addMess.rejected, (state, action) => {
        state.addMessLoading = false;
        state.addMessError = action.payload?.message || "Failed to add mess";
        state.addMessSuccess = false;
      })
      
      // Get All Messes
      .addCase(getAllMesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllMesses.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.messes = action.payload.data.messes || [];
          state.pagination = action.payload.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalMesses: 0,
            hasNext: false,
            hasPrev: false,
          };
        }
      })
      .addCase(getAllMesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch messes";
      })
      
      // Get Mess by ID
      .addCase(getMessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentMess = action.payload.data;
        }
      })
      .addCase(getMessById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch mess";
      })
      .addCase(advancedSearchMesses.pending, (state) => {
        state.isSearchLoading = true;
        state.searchError = null;
      })
      .addCase(advancedSearchMesses.fulfilled, (state, action) => {
        state.isSearchLoading = false;
        if (action.payload.success) {
          state.messes = action.payload.data.messes || [];
          state.pagination = {
            currentPage: action.payload.data.pagination?.currentPage || 1,
            totalPages: action.payload.data.pagination?.totalPages || 1,
            totalMesses: action.payload.data.pagination?.totalMesses || 0,
            hasNext: action.payload.data.pagination?.hasNext || false,
            hasPrev: action.payload.data.pagination?.hasPrev || false,
          };
          
          // Update filters with current search params
          if (action.payload.data.filters) {
            state.searchFilters = { 
              ...state.searchFilters, 
              ...action.payload.data.filters 
            };
          }
        }
      })
      .addCase(advancedSearchMesses.rejected, (state, action) => {
        state.isSearchLoading = false;
        state.searchError = action.payload?.message || "Search failed";
        state.messes = [];
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          totalMesses: 0,
          hasNext: false,
          hasPrev: false,
        };
      });
  },
});

export const {
  updateFilters,
  clearFilters,
  clearSearchResults,
  setCurrentPage,
  resetAddMessState,
  clearErrors
} = messSlice.actions;

export default messSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addMess = createAsyncThunk(
  "mess/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/mess/add`,
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
      console.log("Backend error:", error);
      
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
        `${import.meta.env.VITE_BACKEND_URL}/mess/get-all-mess`,
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
        `${import.meta.env.VITE_BACKEND_URL}/mess/get-mess-info/${messId}`,
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
      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => 
          value !== "" && value !== null && value !== undefined
        )
      );

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/mess/get-mess-search-with-sort`,
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

export const deleteMess = createAsyncThunk(
  "mess/delete",
  async({ rejectWithValue }) =>{
    try {
      console.log("calling delete mess function")
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something is wrong"
        }
      ) 
    }
  }
)

const messSlice = createSlice({
  name: "mess",
  initialState: {
    messes: [],
    currentMess: null,
    
    addMessLoading: false,
    addMessError: null,
    addMessSuccess: false,
    newlyAddedMess: null,

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
    
    // FIXED: Only use isMessLoading, remove isSearchLoading for consistency
    isMessLoading: false,
    
    error: null,
    searchError: null,
  },
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
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
    
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
    },
    
    resetAddMessState: (state) => {
      state.addMessLoading = false;
      state.addMessError = null;
      state.addMessSuccess = false;
      state.newlyAddedMess = null;
    },
    
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
        state.isMessLoading = true;
        state.error = null;
      })
      .addCase(getAllMesses.fulfilled, (state, action) => {
        state.isMessLoading = false;
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
        state.isMessLoading = false;
        state.error = action.payload?.message || "Failed to fetch messes";
      })
      
      // Get Mess by ID
      .addCase(getMessById.pending, (state) => {
        state.isMessLoading = true;
        state.error = null;
      })
      .addCase(getMessById.fulfilled, (state, action) => {
        state.isMessLoading = false;
        if (action.payload.success) {
          state.currentMess = action.payload.data;
        }
      })
      .addCase(getMessById.rejected, (state, action) => {
        state.isMessLoading = false;
        state.error = action.payload?.message || "Failed to fetch mess";
      })
      
      // Advanced Search Messes - FIXED: Use isMessLoading instead of isSearchLoading
      .addCase(advancedSearchMesses.pending, (state) => {
        state.isMessLoading = true;
        state.searchError = null;
      })
      .addCase(advancedSearchMesses.fulfilled, (state, action) => {
        state.isMessLoading = false;
        if (action.payload.success) {
          state.messes = action.payload.data.messes || [];
          state.pagination = {
            currentPage: action.payload.data.pagination?.currentPage || 1,
            totalPages: action.payload.data.pagination?.totalPages || 1,
            totalMesses: action.payload.data.pagination?.totalMesses || 0,
            hasNext: action.payload.data.pagination?.hasNext || false,
            hasPrev: action.payload.data.pagination?.hasPrev || false,
          };
          
          if (action.payload.data.filters) {
            state.searchFilters = { 
              ...state.searchFilters, 
              ...action.payload.data.filters 
            };
          }
        }
      })
      .addCase(advancedSearchMesses.rejected, (state, action) => {
        state.isMessLoading = false;
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
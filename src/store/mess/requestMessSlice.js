import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for sending mess view request
export const sendMessViewRequest = createAsyncThunk(
  "messView/sendRequest",
  async ({ messId, ownerId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/request/add/${messId}?ownerId=${ownerId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      // Use rejectWithValue to properly pass the error to the rejected case
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "Failed to send request"
      );
    }
  }
);
export const updateRequestStatus = createAsyncThunk(
  "messView/updateStatus",
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/request/update/${requestId}`,
        { status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update request status"
      );
    }
  }
);

export const getAllRequests = createAsyncThunk(
  "messView/getAllRequests",
  async ({filters = {},ownerId}, { rejectWithValue }) => {
    console.log("Owner ID in thunk:", ownerId);
    try {
      const { page = 1, limit = 10} = filters;
      const response = await axios.get(
        `http://localhost:8000/api/v1/request/get-all-request/${ownerId}?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch requests"
      );
    }
  }
);

export const getRequestDetails = createAsyncThunk(
  "messView/getRequestDetails",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/request/get-details/${requestId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch request details"
      );
    }
  }
);

export const getRequestsByMess = createAsyncThunk(
  "messView/getRequestsByMess",
  async ({ messId, filters = {} }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status } = filters;
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await axios.get(
        `http://localhost:8000/api/v1/request/mess/${messId}?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch mess requests"
      );
    }
  }
);

export const getMyRequests = createAsyncThunk(
  "messView/getMyRequests",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status } = filters;
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await axios.get(
        `http://localhost:8000/api/v1/request/get-all-request-user?${params.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your requests"
      );
    }
  }
);

const requestMessSlice = createSlice({
  name: "messView",
  initialState: {
    // Send Request States
    loading: false,
    success: false,
    error: null,
    
    // All Requests States (for owners)
    requests: [],
    requestsLoading: false,
    requestsError: null,
    
    // My Requests States (for users)
    myRequests: [],
    myRequestsLoading: false,
    myRequestsError: null,
    
    // Request Details States
    currentRequest: null,
    detailsLoading: false,
    detailsError: null,
    
    // Update Status States
    updateLoading: false,
    updateError: null,
    
    // Pagination for owner requests
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalRequests: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10
    },
    
    // Pagination for user requests
    myRequestsPagination: {
      currentPage: 1,
      totalPages: 0,
      totalRequests: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10
    }
  },
  reducers: {
    clearMessViewState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.requestsError = null;
      state.myRequestsError = null;
      state.detailsError = null;
      state.updateError = null;
    },
    resetSuccessState: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
      state.requestsError = null;
      state.myRequestsError = null;
      state.detailsError = null;
      state.updateError = null;
    },
    clearRequests: (state) => {
      state.requests = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalRequests: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
      };
    },
    clearMyRequests: (state) => {
      state.myRequests = [];
      state.myRequestsPagination = {
        currentPage: 1,
        totalPages: 0,
        totalRequests: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
      };
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
    updateRequestInList: (state, action) => {
      const { requestId, updates } = action.payload;
      const index = state.requests.findIndex(req => req._id === requestId || req.id === requestId);
      if (index !== -1) {
        state.requests[index] = { ...state.requests[index], ...updates };
      }
    },
    updateMyRequestInList: (state, action) => {
      const { requestId, updates } = action.payload;
      const index = state.myRequests.findIndex(req => req._id === requestId || req.id === requestId);
      if (index !== -1) {
        state.myRequests[index] = { ...state.myRequests[index], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Send Request
      .addCase(sendMessViewRequest.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendMessViewRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(sendMessViewRequest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get All Requests (for owners)
      .addCase(getAllRequests.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = null;
        console.log("Fetched requests:", action.payload);
        state.requests = action.payload.data?.requests || action.payload.requests || [];
        
        // Handle pagination data
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        } else if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload;
        state.requests = [];
      })

      // Get My Requests (for users)
      .addCase(getMyRequests.pending, (state) => {
        state.myRequestsLoading = true;
        state.myRequestsError = null;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.myRequestsLoading = false;
        state.myRequestsError = null;
        console.log("Fetched my requests:", action.payload);
        state.myRequests = action.payload.data?.requests || action.payload.requests || [];
        
        // Handle pagination data for my requests
        if (action.payload.data?.pagination) {
          state.myRequestsPagination = action.payload.data.pagination;
        } else if (action.payload.pagination) {
          state.myRequestsPagination = action.payload.pagination;
        }
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.myRequestsLoading = false;
        state.myRequestsError = action.payload;
        state.myRequests = [];
      })

      // Get Request Details
      .addCase(getRequestDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getRequestDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = null;
        state.currentRequest = action.payload.data?.request || action.payload.request || null;
      })
      .addCase(getRequestDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
        state.currentRequest = null;
      })

      // Update Request Status
      .addCase(updateRequestStatus.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        
        // Update the request in the currentRequest if it matches
        const updatedRequest = action.payload.data?.request || action.payload.request;
        if (updatedRequest && state.currentRequest && 
            (state.currentRequest._id === updatedRequest._id || state.currentRequest.id === updatedRequest.id)) {
          state.currentRequest = { ...state.currentRequest, ...updatedRequest };
        }
        
        // Update the request in the owner's requests list
        if (updatedRequest) {
          const requestId = updatedRequest._id || updatedRequest.id;
          const index = state.requests.findIndex(req => 
            req._id === requestId || req.id === requestId
          );
          if (index !== -1) {
            state.requests[index] = { ...state.requests[index], ...updatedRequest };
          }
        }
        
        // Update the request in the user's myRequests list
        if (updatedRequest) {
          const requestId = updatedRequest._id || updatedRequest.id;
          const myIndex = state.myRequests.findIndex(req => 
            req._id === requestId || req.id === requestId
          );
          if (myIndex !== -1) {
            state.myRequests[myIndex] = { ...state.myRequests[myIndex], ...updatedRequest };
          }
        }
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export const { 
  clearMessViewState, 
  resetSuccessState, 
  clearError, 
  clearRequests, 
  clearMyRequests,
  clearCurrentRequest,
  updateRequestInList,
  updateMyRequestInList
} = requestMessSlice.actions;

export default requestMessSlice.reducer;
// store/slices/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = import.meta.env.VITE_BACKEND_URL;

// Async thunks
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api}/admin/delete-user/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteOwner = createAsyncThunk(
  'users/deleteOwner',
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${api}/admin/delete-owner/${ownerId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const modifyUser = createAsyncThunk(
  'users/modifyUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api}/admin/modify-user/${userId}`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const modifyOwner = createAsyncThunk(
  'users/modifyOwner',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${api}/admin/modify-owner/${userId}`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const getUserStatistics = createAsyncThunk(
  'users/getUserStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/admin/get-user-statistics`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkUserActions = createAsyncThunk(
  'users/bulkUserActions',
  async ({ userIds, action }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/admin/users/bulk-actions`, {
        userIds,
        action
      }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all students
export const getAllStudents = createAsyncThunk(
  'users/getAllStudents',
  async ({ page = 1, limit = 10, search = '', role="student" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/admin/get-users`, {
        params: { page, limit, search, role },
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all owners
export const getAllOwners = createAsyncThunk(
  'users/getAllOwners',
  async ({ page = 1, limit = 10, search = '', role= "owner" } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/admin/get-users`, {
        params: { page, limit, search, role },
        withCredentials: true,
      });
      console.log("get all owner: ", response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get user by ID
export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${api}/admin/users/${userId}`, {
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
  // Students state
  students: {
    list: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalStudents: 0,
      hasNext: false,
      hasPrev: false
    }
  },
  // Owners state
  owners: {
    list: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalOwners: 0,
      totalMessCount: 0,   
      hasNext: false,
      hasPrev: false
    }
  },
  // Current user for detail view
  currentUser: null,
  
  userStatistics: {
    byRole: {},
    overall: {
      totalUsers: 0,
      totalActive: 0,
      latestUser: null
    }
  },
  
  loading: false,
  error: null,
  actionLoading: false,
  actionError: null,
  filters: {
    role: '',
    search: ''
  }
};

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.actionError = null;
    },
    clearUsers: (state) => {
      state.students.list = [];
      state.owners.list = [];
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { role: '', search: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all students
      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        // Update students data based on API response structure
        state.students.list = action.payload?.users || [];
        state.students.pagination = action.payload?.pagination || initialState.students.pagination;
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch students';
      })
      
      // Get all owners
      .addCase(getAllOwners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOwners.fulfilled, (state, action) => {
        state.loading = false;
        // Update owners data based on API response structure
        console.log(action.payload , "user admin slice")
        state.owners.list = action.payload.data?.users || []; 
        state.owners.pagination = action.payload.data?.pagination || initialState.owners.pagination;
      })
      .addCase(getAllOwners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch owners';
      })
      
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      })
      
      // Delete user (student)
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove deleted student from state
        state.students.list = state.students.list.filter(student => student._id !== action.meta.arg);
        state.students.pagination.totalStudents -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to delete user';
      })
      
      // Delete owner
      .addCase(deleteOwner.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteOwner.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove deleted owner from state
        state.owners.list = state.owners.list.filter(owner => owner._id !== action.meta.arg);
        state.owners.pagination.totalOwners -= 1;
      })
      .addCase(deleteOwner.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to delete owner';
      })
      
      // Modify user (student)
      .addCase(modifyUser.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(modifyUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update student in state
        const updatedUser = action.payload.data;
        const index = state.students.list.findIndex(student => student._id === updatedUser._id);
        if (index !== -1) {
          state.students.list[index] = updatedUser;
        }
      })
      .addCase(modifyUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to update user';
      })
      
      // Modify owner
      .addCase(modifyOwner.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(modifyOwner.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update owner in state
        const updatedOwner = action.payload.data;
        const index = state.owners.list.findIndex(owner => owner._id === updatedOwner._id);
        if (index !== -1) {
          state.owners.list[index] = updatedOwner;
        }
      })
      .addCase(modifyOwner.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to update owner';
      })
      
      // Get user statistics
      .addCase(getUserStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.userStatistics = action.payload.data || initialState.userStatistics;
      })
      .addCase(getUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch statistics';
      })
      
      // Bulk user actions
      .addCase(bulkUserActions.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(bulkUserActions.fulfilled, (state, action) => {
        state.actionLoading = false;
        const { userIds, action: bulkAction } = action.meta.arg;
        
        if (bulkAction === 'delete') {
          // Remove deleted users from both students and owners
          state.students.list = state.students.list.filter(student => !userIds.includes(student._id));
          state.owners.list = state.owners.list.filter(owner => !userIds.includes(owner._id));
        } else if (bulkAction === 'activate' || bulkAction === 'deactivate') {
          // Update isActive status for users in both lists
          const isActive = bulkAction === 'activate';
          state.students.list = state.students.list.map(student => 
            userIds.includes(student._id) ? { ...student, isActive } : student
          );
          state.owners.list = state.owners.list.map(owner => 
            userIds.includes(owner._id) ? { ...owner, isActive } : owner
          );
        }
      })
      .addCase(bulkUserActions.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload?.message || 'Failed to perform bulk action';
      });
  }
});

// Export actions
export const { 
  clearError, 
  clearUsers, 
  clearCurrentUser, 
  setFilters, 
  clearFilters 
} = usersSlice.actions;

// Export selectors
export const selectStudents = (state) => state.admin.students;
export const selectOwners = (state) => state.admin.owners;
export const selectCurrentUser = (state) => state.admin.currentUser;
export const selectUserStatistics = (state) => state.admin.userStatistics;
export const selectUsersLoading = (state) => state.admin.loading;
export const selectUsersError = (state) => state.admin.error;
export const selectActionLoading = (state) => state.admin.actionLoading;
export const selectActionError = (state) => state.admin.actionError;
export const selectStudentPagination = (state) => state.admin.students.pagination;
export const selectOwnerPagination = (state) => state.admin.owners.pagination;
export const selectFilters = (state) => state.admin.filters;

export default usersSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  message: "",
  error: null,
};

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ userName, email, password, role, phonenumber }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        {
          email,
          password,
          role,
          phone: phonenumber,
          name: userName,
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/user/logout",
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (!error.response?.data?.success) {
      return error.response?.data || "Something went wrong";
    }
  }
});

// Generate Reset Code
export const generateResetCode = createAsyncThunk(
  "auth/generateResetCode",
  async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/forgot-password",
        { email }
      );
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);

// Verify Reset Code
export const verifyResetCode = createAsyncThunk(
  "auth/verifyResetCode",
  async ({ email, code }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/verify-code",
        { email, code }
      );
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/reset-password",
        { resetToken, newPassword }
      );
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);
export const getStudentById = createAsyncThunk(
  "auth/getStudentById",
  async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/get-student-id/${studentId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);

// Check Auth Status
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/v1/user/check-auth",
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (!error.response?.data?.success) {
      return error.response?.data || "Something went wrong";
    }
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = "";
    },
    clearUsers: (state) => {
      state.users = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.user = action.payload.data;
          state.message = action.payload.message;
          state.error = null;
        } else {
          state.error = action.payload?.message || "Registration failed";
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error?.message || "Registration failed";
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          console.log(action.payload);
          state.user = action.payload.data?.user;
          state.isAuthenticated = true;
          state.message = action.payload.message;
          state.error = null;

          // Store token in localStorage for easy access
          if (action.payload.data?.token) {
            localStorage.setItem("token", action.payload.data.token);
          }
        } else {
          state.error = action.payload?.message || "Login failed";
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error?.message || "Login failed";
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.user = null;
          state.isAuthenticated = false;
          state.message = action.payload.message || "Logged out successfully";
          state.error = null;

          // Clear localStorage
          localStorage.removeItem("token");
        } else {
          state.error = action.payload?.message || "Logout failed";
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Logout failed";
      })

      // Generate Reset Code
      .addCase(generateResetCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateResetCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.message = action.payload.message;
          state.error = null;
        } else {
          state.error =
            action.payload?.message || "Failed to generate reset code";
        }
      })
      .addCase(generateResetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to generate reset code";
      })

      // Verify Reset Code
      .addCase(verifyResetCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.message = action.payload.message;
          state.error = null;
        } else {
          state.error = action.payload?.message || "Invalid reset code";
        }
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Invalid reset code";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.message = action.payload.message;
          state.error = null;
        } else {
          state.error = action.payload?.message || "Password reset failed";
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Password reset failed";
      })
      // Check Auth Status
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.user = action.payload.data;
          state.isAuthenticated = true;
          state.error = null;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.error = action.payload?.message || "Not authenticated";
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error?.message || "Not authenticated";
      })
      .addCase(getStudentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { clearError, clearUsers, setLoading } = authSlice.actions;
export default authSlice.reducer;

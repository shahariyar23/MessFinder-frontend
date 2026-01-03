import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  otpPending: false, // ✅ ADD
  message: "",
  error: null,
  users: []
};

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ userName, email, password, role, phonenumber }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/register`,
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
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response, "from auth store");
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);

// OTP SEND
export const verificationLoginOtp = createAsyncThunk(
  "auth/verificationLoginOtp",
  async ({ email, otp }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/verify-login`,
        { email, otp },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || "OTP verification failed";
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/user/logout`,
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
    console.group(email);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/forgot-password`,
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
    console.log(email, code);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/verify-code`,
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
  async ({ email, code, newPassword }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/reset-password`,
        { email, code, newPassword }
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
        `${import.meta.env.VITE_BACKEND_URL}/user/get-student-id/${studentId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      if (!error.response?.data?.success) {
        return error.response?.data || "Something went wrong";
      }
    }
  }
);

// Check Auth Status
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/check-auth`,
        {
          withCredentials: true, // ✅ THIS IS ALL YOU NEED
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        authenticated: false,
        message:
          error.response?.data?.message || "Authentication check failed",
      });
    }
  }
);


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
          // 🔐 OTP REQUIRED
          if (action.payload.otpRequired) {
            state.otpPending = true;
            state.user = null;
            state.isAuthenticated = false;
            state.message = action.payload.message;
            return;
          }

          // ✅ NORMAL LOGIN (NO OTP)
          state.user = action.payload.data?.user;
          state.isAuthenticated = true;
          state.otpPending = false;
          state.message = action.payload.message;

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

      .addCase(verificationLoginOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verificationLoginOtp.fulfilled, (state, action) => {
        state.isLoading = false;
console.log(action.payload, "verification login page")
        if (action.payload?.success) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.otpPending = false;
          state.message = action.payload.message;

          if (action.payload.data.token) {
            localStorage.setItem("token", action.payload.data.token);
          }
        } else {
          state.error = action.payload?.message || "Invalid OTP";
        }
      })
      .addCase(verificationLoginOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Invalid OTP";
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

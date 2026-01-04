import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/* ---------------- FETCH HOME SLIDE ---------------- */
export const fetchHomeSlide = createAsyncThunk(
  "home/fetchSlide",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/get-home-page-slider`,
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch slide" }
      );
    }
  }
);

/* ---------------- SAVE HOME SLIDE ---------------- */
export const saveHomeSlide = createAsyncThunk(
  "home/saveSlide",
  async (slide, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("title", slide.title);
      formData.append("description", slide.description);
      formData.append("buttonText", slide.buttonText);
      formData.append("buttonLink", slide.buttonLink);

      if (slide.image) {
        formData.append("image", slide.image);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/home-page-slider`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to save slide" }
      );
    }
  }
);

// delete home slider
export const deleteHomeSlide = createAsyncThunk(
  "home/deleteSlide",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/home-slider-delete/${id}`,
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete slide" }
      );
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    slide: [],
    isLoading: false,
    isSaving: false,
    error: null,
  },
  reducers: {
    clearHomeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeSlide.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHomeSlide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.slide = action.payload?.data || [];
      })
      .addCase(fetchHomeSlide.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      .addCase(saveHomeSlide.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveHomeSlide.fulfilled, (state) => {
        state.isSaving = false;
      })
      .addCase(saveHomeSlide.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteHomeSlide.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteHomeSlide.fulfilled, (state, action) => {
        state.slide = state.slide.filter((s) => s._id !== action.meta.arg);
        state.isLoading = false;
      })
      .addCase(deleteHomeSlide.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { clearHomeError } = homeSlice.actions;
export default homeSlice.reducer;

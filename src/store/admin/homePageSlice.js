import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
/**
 * GET → Fetch slides for homepage
 */
export const fetchHomeSlides = createAsyncThunk(
  "home/fetchSlides",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/get-home-page-slider`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to load home slides" }
      );
    }
  }
);

/**
 * POST → Save / update slides (Admin only)
 */
export const saveHomeSlides = createAsyncThunk(
  "home/saveSlides",
  async (slides, { rejectWithValue }) => {
    try {
      const formData = new FormData();


      slides.forEach((slide, index) => {
        formData.append(`slides[${index}][title]`, slide.title);
        formData.append(`slides[${index}][description]`, slide.description);
        formData.append(`slides[${index}][buttonText]`, slide.buttonText);
        formData.append(`slides[${index}][buttonLink]`, slide.buttonLink);

        if (slide.image) {
          formData.append(`slides[${index}][image]`, slide.image);
        }
      });
console.log(formData, "slice page");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/home-page-slider`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to save home slides" }
      );
    }
  }
);

const initialState = {
  slides: [],
  isLoading: false,
  isSaving: false,
  error: null,
  success: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 FETCH SLIDES
      .addCase(fetchHomeSlides.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeSlides.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.slides = action.payload.data || [];
        }
      })
      .addCase(fetchHomeSlides.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load slides";
      })

      //  SAVE SLIDES (ADMIN)
      .addCase(saveHomeSlides.pending, (state) => {
        state.isSaving = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveHomeSlides.fulfilled, (state, action) => {
        state.isSaving = false;
        if (action.payload?.success) {
          state.success = true;
        }
      })
      .addCase(saveHomeSlides.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message || "Failed to save slides";
      });
  },
});

export const { clearHomeState } = homeSlice.actions;
export default homeSlice.reducer;

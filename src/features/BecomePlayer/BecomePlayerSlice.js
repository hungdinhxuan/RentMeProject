import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "utils/axiosClient";
import { ToastSweet } from "components/SweetAlert2";

const initialState = {
  serviceGames: [],
  loading: false,
  error: null,
};

export const getAllServicesAsync = createAsyncThunk(
  "becomeplayer/services",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`services`);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const BecomePlayerSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllServicesAsync.pending]: (state) => {
      state.loading = true;
    },
    [getAllServicesAsync.fulfilled]: (state, action) => {
      state.serviceGames = action.payload.services;
      state.loading = false;
      state.error = null;
    },
    [getAllServicesAsync.rejected]: (state, action) => {
      state.serviceGames = [];
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

const { reducer } = BecomePlayerSlice;
export default reducer;

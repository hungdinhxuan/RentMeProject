import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";

const initialState = {
  userList: [],
  userEdit: null,
  loading: false,
  error: null,
};

export const getAllUsersAsync = createAsyncThunk(
  "admin/users",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`users`);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    EditUser(state, action) {
      state.userEdit = action.payload;
    },
  },
  extraReducers: {
    [getAllUsersAsync.pending]: (state) => {
      state.loading = true;
    },
    [getAllUsersAsync.fulfilled]: (state, action) => {
      state.userList = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getAllUsersAsync.rejected]: (state, action) => {
      state.userList = [];
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

const { reducer } = AdminSlice;
export const { EditUser } = AdminSlice.actions;
export default reducer;

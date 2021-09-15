import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";

const initialState = {
  user: null,
  loading: false,
  error: "",
};

console.log(process.env);
export const AsyncSignin = createAsyncThunk("auth/signin", async (data) => {
  const response = await axiosClient.post("/auth/login", data);
  console.log(response.data);
  return response.data;
});

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [AsyncSignin.pending]: (state) => {
      state.loading = true;
    },
    [AsyncSignin.fulfilled]: (state, action) => {
      state.user = action.payload;
      console.log(action.payload);
      state.loading = false;
    },
    [AsyncSignin.rejected]: (state, action) => {
      state.error = action.payload;
      console.log(action.payload);
    },
  },
});

const { reducer } = AuthSlice;

export default reducer;

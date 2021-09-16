import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const AsyncSignin = createAsyncThunk("auth/signin", async (values,{rejectWithValue}) => {
  try {
    const response = await axiosClient.post("/auth/login", values);
    
    return response;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
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
      state.loading = false;
      state.error = null;
      localStorage.setItem('token',state.user.token);
    },
    [AsyncSignin.rejected]: (state, action) => {
      state.error = action.payload.message || "Đăng ký không thành công";
    },
  },
});

const { reducer } = AuthSlice;

export default reducer;

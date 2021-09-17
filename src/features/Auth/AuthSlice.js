import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const handleNoti = (icon, title, text) => {
  Swal.fire({
    icon: `${icon}`,
    title: `${title}`,
    text: `${text}`,
  });
};

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const AsyncSignin = createAsyncThunk(
  "auth/signin",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", values);
      handleNoti("success", "Đăng nhập thành công", "");
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const AsyncSignup = createAsyncThunk(
  "auth/signup",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/register", values);
      handleNoti("success", "Đăng ký thành công", "");
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

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
      localStorage.setItem("token", state.user.token);
    },
    [AsyncSignin.rejected]: (state, action) => {
      state.error = action.payload.message || "Đăng nhập không thành công";
      handleNoti("error", "Đăng nhập thất bại", `${state.error}`);
    },

    [AsyncSignup.pending]: (state) => {
      state.loading = true;
    },
    [AsyncSignup.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    [AsyncSignup.rejected]: (state, action) => {
      state.error = action.payload.message || "Đăng ký không thành công";
      handleNoti("error", `${state.error}`, "");
    },
  },
});

const { reducer } = AuthSlice;

export default reducer;

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
  isAuthenticated: false,
  userSignup: null
};

export const AsyncLoadUser = createAsyncThunk(
  "auth/loaduser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/auth");
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.isAuthenticated = false;
    }
  },
  extraReducers: {
    
  },
});

const { reducer } = AuthSlice;
export const {logout} = AuthSlice.actions;

export default reducer;
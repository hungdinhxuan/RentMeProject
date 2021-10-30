import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "utils/axiosClient";
import { toast } from "react-toastify";
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

export const AsyncSignin = createAsyncThunk(
  "auth/signin",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", values);
      handleNoti("success", "Đăng nhập thành công", "");
  
      if (response.success) {
        localStorage.setItem("token", response.token);
      }
      
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

export const AsyncForgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch("/auth/forgot-password", values);
      toast("Gửi email thành công", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: false,
        progress: undefined,
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// file IMG
export const AsyncUpdateAvatar = createAsyncThunk(
  "setting/updateAvatar",
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", values.file);
      console.log(values);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const response = await axiosClient.patch(
        `/users/${values.id}/avatar`,
        formData,
        config
      );
      
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
    [AsyncLoadUser.pending]: (state) => {
      state.loading = true;
    },
    [AsyncLoadUser.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    [AsyncLoadUser.rejected]: (state, action) => {
      state.user = null;
      state.loading = false;
      state.isAuthenticated = false;
    },

    [AsyncSignin.pending]: (state) => {
      state.loading = true;
    },
    [AsyncSignin.fulfilled]: (state) => {
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
    },
    [AsyncSignin.rejected]: (state, action) => {
      state.error = action.payload.message || "Đăng nhập không thành công";
      state.loading = false;
      handleNoti("error", "Đăng nhập thất bại", `${state.error}`);
    },

    [AsyncSignup.pending]: (state) => {
      state.loading = true;
    },
    [AsyncSignup.fulfilled]: (state, action) => {
      state.userSignup = action.payload;
      state.loading = false;
      state.error = null;
    },
    [AsyncSignup.rejected]: (state, action) => {
      state.error = action.payload.message || "Đăng ký không thành công";
      handleNoti("error", `${state.error}`, "");
    },

    [AsyncForgotPassword.fulfilled]: (state) => {
      state.loading = false;
      state.error = null;
    },
    [AsyncForgotPassword.rejected]: (state, action) => {
      state.error = action.payload.message || "Gửi email không thành công";
      toast(`${state.error}`, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: false,
        progress: undefined,
      });
    },
  },
});


export const {logout} = AuthSlice.actions;
export default AuthSlice.reducer;

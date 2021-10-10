import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";
import { toastSuccess } from "components/Toastify/toastHelper";
import Swal from "sweetalert2";
const initialState = {
  fileAvatar: null,
  loading: false,
  error: null,
};

const handleNoti = (icon, title, text) => {
  Swal.fire({
    icon: `${icon}`,
    title: `${title}`,
    text: `${text}`,
  });
};

export const AsyncUpdateAvatar = createAsyncThunk(
  "setting/updateAvatar",
  async (values, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", values.file);

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

const SettingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: {
    [AsyncUpdateAvatar.pending]: (state) => {
      state.loading = true;
    },
    [AsyncUpdateAvatar.fulfilled]: (state, action) => {
      state.fileAvatar = action.payload;
      state.loading = false;
      state.error = null;
      toastSuccess();
    },
    [AsyncUpdateAvatar.rejected]: (state, action) => {
      state.fileAvatar = null;
      state.loading = false;
      state.error = action.payload.message;
      ;
    },
  },
});

const { reducer } = SettingSlice;
export default reducer;

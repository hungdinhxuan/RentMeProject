import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";
import { toastError, toastSuccess } from "components/Toastify/toastHelper";

const initialState = {
  fileAvatar: null,
  loading: false,
  error: null,
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

export const AsyncUpdateProfile = createAsyncThunk(
  "setting/updateProfile",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`users/${values.id}`, values);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const AsyncUpdatePassword = createAsyncThunk(
  "setting/updatePassword",
  async (values, { rejectWithValue }) => {
    try {
      console.log(values);
      const response = await axiosClient.patch(`users/${values.id}/password`, values);
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
      toastSuccess('Update avatar successful!');
    },
    [AsyncUpdateAvatar.rejected]: (state, action) => {
      state.fileAvatar = null;
      state.loading = false;
      state.error = action.payload.message;
    },
    [AsyncUpdateProfile.pending]: (state) => {
      state.loading = true;
    },
    [AsyncUpdateProfile.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      toastSuccess('Update profile successful!');
    },
    [AsyncUpdateProfile.rejected]: (state, action) => {
      state.fileAvatar = null;
      state.loading = false;
      state.error = action.payload;
      
    },
    // Change password
    [AsyncUpdatePassword.pending]: (state) => {
      state.loading = true;
    },
    [AsyncUpdatePassword.fulfilled]: (state) => {
      state.loading = false;
      state.error = null;
      toastSuccess('Change password successful!');
    },
    [AsyncUpdatePassword.rejected]: (state, action) => {
      state.fileAvatar = null;
      state.loading = false;
      state.error = action.payload;
      toastError();
    },
  },
});

const { reducer } = SettingSlice;
export default reducer;

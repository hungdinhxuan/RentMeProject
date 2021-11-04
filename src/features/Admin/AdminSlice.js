import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "utils/axiosClient";
import {ToastSweet} from "components/SweetAlert2"

const initialState = {
  userList: [],
  bannedPlayers: [],
  userEdit: null,
  loading: false,
  error: null
};

export const getAllUsersAsync = createAsyncThunk(
  "admin/users",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`managements/users`);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const softDeleteUsersAsync = createAsyncThunk(
  "admin/users/softDelete",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`managements/users/soft`, {
        data: {
          ids: values
        }
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const forceDeleteUsersAsync = createAsyncThunk(
  "admin/users/forceDelete",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`managements/users/force`, {
        data: {
          ids: values
        }
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getBannedPlayersAsync = createAsyncThunk(
  "admin/players/banned",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`managements/players/banned`, {
        data: {
          ids: values
        }
      });
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const unlockPlayersAsync = createAsyncThunk(
  "admin/players/banned",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch(`managements/players`, {
        data: {
          ids: values
        }
      });
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
    [softDeleteUsersAsync.pending]: (state) => {
      state.loading = true;
    },
    [softDeleteUsersAsync.fulfilled]: (state, action) => {
      state.userList = state.userList.filter(user => !action.payload.userIds.includes(user._id)) ;
      state.loading = false;
      state.error = null;
      ToastSweet("success", action.payload.message, "bottom-end")
    },
    [softDeleteUsersAsync.rejected]: (state, action) => {
      
      state.loading = false;
      state.error = action.payload.message;
      ToastSweet("error", action.payload.message || "Something Wrong Happened !!", "bottom-end")
    },
    [getBannedPlayersAsync.pending]: (state) => {
      state.loading = true;
    },
    [getBannedPlayersAsync.fulfilled]: (state, action) => {
      state.bannedPlayers = action.payload.players;
      state.loading = false;
      state.error = null;
    },
    [getBannedPlayersAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
      ToastSweet("error", action.payload.message || "Something Wrong Happened !!", "bottom-end")
    },
  },
});

const { reducer } = AdminSlice;
export const { EditUser } = AdminSlice.actions;
export default reducer;

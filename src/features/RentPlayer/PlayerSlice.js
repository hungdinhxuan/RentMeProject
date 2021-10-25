import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";


// const handleNoti = (icon, title, text) => {
//   Swal.fire({
//     icon: `${icon}`,
//     title: `${title}`,
//     text: `${text}`,
//   });
// };

const initialState = {
  listPlayers: null,
  loading: false,
  error: null,
  player: null,
  reviews: []
};

export const AsyncLoadPlayer = createAsyncThunk(
  "player/loadplayer",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/players?page=1&limit=50&status=true"
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const AsyncLoadPlayerDetails = createAsyncThunk(
  "player/loadplayerdetails",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/players/${values}`);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const AsyncGetReviews = createAsyncThunk(
  "player/loadReviews",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/players/${values}/reviews`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const PlayerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playerDetails: (state, action) => {
      state.player = action.payload;
    },
  },
  extraReducers: {
    [AsyncLoadPlayer.pending]: (state) => {
      state.loading = true;
    },
    [AsyncLoadPlayer.fulfilled]: (state, action) => {
      state.listPlayers = action.payload;
      state.loading = false;
      state.error = null;
    },
    [AsyncLoadPlayer.rejected]: (state, action) => {
      state.listPlayers = null;
      state.loading = false;
      state.error = action.payload.message;
    },

    [AsyncLoadPlayerDetails.fulfilled]: (state, action) => {
      state.player = action.payload;
      state.loading = false;
      state.error = null;
    },
    [AsyncLoadPlayerDetails.rejected]: (state, action) => {
      state.player = null;
      state.loading = false;
      state.error = action.payload.message;
    },

    [AsyncGetReviews.fulfilled]: (state, action) => {
      state.reviews = action.payload;
      state.loading = false;
      state.error = null;
    }
  },
});

const { reducer } = PlayerSlice;
export const { logout } = PlayerSlice.actions;

export default reducer;

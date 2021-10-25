import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";


const initialState = {
  listPlayers: null,
  loading: false,
  error: null,
  player: null,
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
      const response = await axiosClient.get(
        `/players/${values}`
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const PlayerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playerDetails: (state,action) => {
      state.player = action.payload;
    }
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
  },
});

const { reducer } = PlayerSlice;
export const { logout } = PlayerSlice.actions;

export default reducer;

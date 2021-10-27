import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";
import socket from "socket";
import Swal from "sweetalert2";

const initialState = {
  listPlayers: [],
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

export const AsyncDonateMoney = createAsyncThunk("player/donate", 
async (values, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post(`/players/${values.id}/donate`, {money: values.money});
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
}
)

export const AsyncFollowPlayer = createAsyncThunk("player/follow", 
async (values, { rejectWithValue }) => {
  try {
    const response = await axiosClient.patch(`/players/${values}/follow`);
    return response;
  } catch (error) {
    
    return rejectWithValue(error.response);
  }
}
)

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
      state.listPlayers = [];
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
    },
    [AsyncDonateMoney.fulfilled]: (state, action) => {
      const {playerName, money, message} = action.payload
      Swal.fire({
        title: message,
        icon: 'success'
      })
      socket.emit('donate money', playerName, money)
      state.loading = false;
      state.error = null;
    },
    [AsyncDonateMoney.rejected]: (state, action) => {
      Swal.fire({
        title: action.payload.message || 'something wrong happen',
        icon: 'error'
      })
    },
    [AsyncFollowPlayer.fulfilled]: (state, action) => {
      state.player.user.follower = action.payload.player.follower
      state.loading = false;
      state.error = null;
      Swal.fire({
        title: action.payload.message,
        icon: 'success'
      })
      if(action.payload.message === 'following success'){
        socket.emit('follow player', action.payload.player.username)
      }
    },
    [AsyncFollowPlayer.rejected]: (state, action) => {
      
      Swal.fire({
        title: action.payload.data || action.payload || 'something wrong happen please try again 1p',
        icon: 'error'
      })
    }
  },
});

const { reducer } = PlayerSlice;
export const { logout } = PlayerSlice.actions;

export default reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";
const initialState = {
  messages: [],
};

export const getAllMessagesAsync = createAsyncThunk("messages/getAll", async (userId) => {
  return await axiosClient.get(`/users/${userId}/messages`)
});


const MessageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    //   playerDetails: (state,action) => {
    //     state.player = action.payload;
    //   }
    addNewMessage(state, action) {
        state.messages.push(action.payload)
      }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllMessagesAsync.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

const { reducer } = MessageSlice;
export const {addNewMessage} = MessageSlice.actions;
export default reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";
const initialState = {
  messages: [],
};

export const getAllMessagesAsync = createAsyncThunk("messages/getAll", async (userId) => {
  return await axiosClient.get(`/users/${userId}/messages`)
});
export const updateMessageAsync = createAsyncThunk("messages/updateMessage", async (values) => {
  return await axiosClient.patch(`/users/${values.userId}/messages/${values.messageId}`)
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
    })
    .addCase(updateMessageAsync.fulfilled, (state, action) => {
      state.messages = state.messages.map((mess) => {
        if(mess._id === action.payload.newMessage._id){
            mess.status = "read";
        }
        return mess;
      });
    })
  },
});

const { reducer } = MessageSlice;
export const {addNewMessage} = MessageSlice.actions;
export default reducer;

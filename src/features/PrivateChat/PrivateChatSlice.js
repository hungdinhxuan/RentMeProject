import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "utils/axiosClient";


const initialState = {
  others: [],
  newContact: null,
  other: null,
  loading: false,
  error: null,
  showPrivateChat: false,
  conversations: [],
  countNewMessages: 0,
};

export const getOthersConversationAsync = createAsyncThunk(
  "privateChat/getOthers",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/conversations/others`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const loadConversations = createAsyncThunk(
  "privateChat/loadConversations",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/conversations/${values.userId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const PrivateChatSlice = createSlice({
  name: "privateChat",
  initialState,
  reducers: {
    setShowPrivateChat(state, action) {
      state.showPrivateChat = !state.showPrivateChat;
      state.others =  []
      state.newContact = null
      state.other =  null
      state.loading = false
      state.error =  null
      state.conversations =  []
      state.countNewMessages = 0
      
    },
    addNewPrivateChat(state, action) {
      state.newContact = action.payload;
      state.showPrivateChat = true;
    },
    setOther(state, action) {
      state.other = action.payload;
    },
    addNewMsgToConversations(state, action) {
      state.conversations.push(action.payload);
    },
    setCountNewMessagesIncrease(state, action) {
      state.countNewMessages++;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOthersConversationAsync.fulfilled, (state, action) => {
        state.others = action.payload.others;
      })
      .addCase(getOthersConversationAsync.rejected, (state, action) => {
        console.log(action.payload);
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.conversations;
      })
      .addCase(loadConversations.rejected, (state, action) => {
        console.log(action.payload);
      })
  },
});

export const {
  setShowPrivateChat,
  addNewPrivateChat,
  setOther,
  addNewMsgToConversations,
  setCountNewMessagesIncrease,
} = PrivateChatSlice.actions;
export default PrivateChatSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";

const initialState = {
    roomId: null,
    roomPassword: null,
    tradingId: null,
    authRoom: false
};

export const authRoomAsync = createAsyncThunk("chatroom/auth", async(values, {rejectWithValue}) => {
    try {
        const response = await axiosClient.post('/tradings', values)
        return response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const ChatRoomSlice = createSlice({
    name: 'chatroom',
    initialState,
    reducers: {
        abortTrading: (state, action) => {
            state.roomId = null
            state.roomPassword =  null
            state.tradingId = null
            state.authRoom = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authRoomAsync.fulfilled, (state, action) => {
            state.roomId = action.payload.roomId
            state.roomPassword = action.payload.roomPassword
            state.tradingId = action.payload.tradingId
            state.authRoom = true
        }).addCase(authRoomAsync.rejected,  (state, action) => {
            console.log(action.payload);
        })
    }
})

export const {abortTrading} = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;
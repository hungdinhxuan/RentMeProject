import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "axiosClient";
import Swal from "sweetalert2";
import {ToastSweet} from 'components/SweetAlert2'

const initialState = {
    roomId: null,
    roomPassword: null,
    tradingId: null,
    authRoom: false,
    expireTime: null
};

export const authRoomAsync = createAsyncThunk("chatroom/auth", async(values, {rejectWithValue}) => {
    try {
        const response = await axiosClient.post('/tradings', values)
        return response
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const createReviewAsync = createAsyncThunk("chatroom/createReview", async(values, {rejectWithValue}) => {
    try {
        const response = await axiosClient.post(`/players/${values.playerId}/reviews`, values)
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
            state.expireTime = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authRoomAsync.fulfilled, (state, action) => {
            state.roomId = action.payload.roomId
            state.roomPassword = action.payload.roomPassword
            state.tradingId = action.payload.tradingId
            state.authRoom = true
            state.expireTime = action.payload.expireTime
        }).addCase(authRoomAsync.rejected,  (state, action) => {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: action.payload.message,
                showConfirmButton: false,
                timer: 1000
              })
        }).addCase(createReviewAsync.fulfilled, (state, action) => {
            ToastSweet('success', action.payload.message)
        }).addCase(createReviewAsync.rejected, (state, action) => {
            ToastSweet('error', action.payload.message)
        })
    }
})

export const {abortTrading} = ChatRoomSlice.actions;
export default ChatRoomSlice.reducer;
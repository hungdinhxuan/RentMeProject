 import VideoChat from "components/VideoChat";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ChatRoom.scss";
import { authRoomAsync } from "./ChatRoomSlice";

export default function ChatRoom() {
  const dispatch = useDispatch();
  
  const { authRoom } = useSelector((state) => state.chatRoom);
  const chatRoom = useSelector((state) => state.chatRoom);
  
  const [roomId, setRoomId] = useState(chatRoom.roomId);
  const [roomPassword, setRoomPassword] = useState(chatRoom.roomPassword);
  const joinRoom = () => {
    
    if (roomId !== "" && roomPassword !== "") {
      dispatch(authRoomAsync({ roomId, roomPassword }));
    }
    setRoomId("");
    setRoomPassword("");
  };

  return (
    <div className="chat-rom">
      {!authRoom ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            value={roomId}
          />
          <input
            type="text"
            placeholder="Password Room..."
            onChange={(event) => {
              setRoomPassword(event.target.value);
            }}
            value={roomPassword}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <VideoChat />
      )}
    </div>
  );
}

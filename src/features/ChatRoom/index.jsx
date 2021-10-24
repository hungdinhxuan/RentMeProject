import VideoChat from "components/VideoChat";
import React, { useState } from "react";
import "./ChatRoom.scss";

export default function ChatRoom() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleChange = (e) => {
    setUserName(e.target.value);
  };
  const joinRoom = () => {
    console.log("Join room");
    if (userName !== "" && room !== "") {
      setShowChat(true);
    }
  };

  return (
    <div>
      {!showChat ? (
        <div className="chat-rom">
          <div className="joinChatContainer">
            <h3>Join A Chat</h3>
            <input
              type="text"
              placeholder="Room ID..."
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Password Room..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button onClick={joinRoom}>Join A Room</button>
          </div>
        </div>
      ) : (
        <div className="chat-success">
          <VideoChat username={userName} room={room} />
        </div>
      )}
    </div>
  );
}

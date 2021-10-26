import React, { useRef, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSelector } from "react-redux";
import { Avatar } from "antd";

export default function ChatStream() {
  const { user } = useSelector((state) => state.auth);
  const [currentMessage, setCurrentMessage] = useState("");
  const a = [...Array(25)];

  // Using ref
  const typingTimeOutRef = useRef(null);

  const handleChangeMessage = (e) => {
    const { value } = e.target;
    setCurrentMessage(value);
    if (typingTimeOutRef.current) {
      clearTimeout(typingTimeOutRef.current);
    }
    typingTimeOutRef.current = setTimeout(() => {
      setCurrentMessage(value);
    }, 1000);
  };

  // console.log('Hello');
  console.log(currentMessage);

  const sendMessage = () => {
    setCurrentMessage("");
  };
  return (
    <div className="global-chat__details">
      <div className="global-chat__display">
        {/* Map message from API */}
        <ScrollToBottom className="scroll-message">
          {a.map((item, index) => (
            <div className="global_message__item" key={index}>
              <div className="message__item--left">
                <Avatar size={40} src={user?.avatar} />
              </div>
              <div className="message__item--center">
                <div className="chat-name">
                  <strong className="name-player-review">
                    {user?.fullName}
                  </strong>
                </div>
                <div className="mess-global">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Dolorum dicta, nam tempore ipsum assumenda neque quia quo nisi
                  enim voluptas corrupti facilis dolores totam fugit.
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
        <div className="input-form">
          <input
            type="text"
            ref={typingTimeOutRef}
            placeholder="Enter to send message"
            id="formChatText"
            onChange={handleChangeMessage}
            value={currentMessage}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
        </div>
      </div>
    </div>
  );
}

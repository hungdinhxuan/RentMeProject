import React, { useRef, useState, useEffect, useCallback} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Avatar } from "antd";
import socket from 'utils/socket'

const path = "stream"
export default function ChatStream() {
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);


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
    }, 30);
  };

  

  const sendMessage = () => {
    socket.emit("message-streamhub", path, currentMessage)
    setCurrentMessage("");
  };

  

  useEffect(() => {
    socket.emit('user-join-streamhub', path)
    const handleMessageStreamhub = (msg) => {
      
      setMessages([...messages, msg])
    }
    socket.on('message-streamhub', handleMessageStreamhub)
    // return () => {
    //   socket.off('message-streamhub', handleMessageStreamhub)
    // }
  }, [messages])



  return (
    <div className="global-chat__details">
      <div className="global-chat__display">
        {/* Map message from API */}
        <ScrollToBottom className="scroll-message">
          {messages.map((item, index) => (
            <div className="global_message__item" key={index}>
              <div className="message__item--left">
                <Avatar size={40} src={item?.avatar} />
              </div>
              <div className="message__item--center">
                <div className="chat-name">
                  <strong className="name-player-review">
                    {item.sender}
                  </strong>
                </div>
                <div className="mess-global">
                  {item.content}
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

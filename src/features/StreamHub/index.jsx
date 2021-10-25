import React, { useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";
import "./StreamHub.scss";

export default function StreamHub() {
  const { user } = useSelector((state) => state.auth);
  const [currentMessage, setCurrentMessage] = useState("");
  const a = [...Array(25)];

  const handleChangeMessage = (e) => {
    console.log(e.target.value);
    setCurrentMessage(e.target.value);
  };
  const sendMessage = () => {
    setCurrentMessage("");
  };
  return (
    <div className="streamhub row">
      <div className="streamhub-video col-md-6 col-12">
        <div className="video-layout">
          <ReactHlsPlayer
            src="http://18.167.59.58:8080/live/hello.m3u8"
            autoPlay={false}
            controls={true}
            width="81%"
            height="45%"
          />
        </div>
      </div>
      <div className="col-md-6 global-chat">
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
                      Dolorum dicta, nam tempore ipsum assumenda neque quia quo
                      nisi enim voluptas corrupti facilis dolores totam fugit.
                    </div>
                  </div>
                </div>
              ))}
            </ScrollToBottom>
            <div className="input-form">
              <input
                type="text"
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
      </div>
    </div>
  );
}

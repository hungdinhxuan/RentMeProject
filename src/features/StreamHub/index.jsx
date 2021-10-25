import React from "react";
import ReactHlsPlayer from "react-hls-player";
import ChatStream from "./ChatStream";
import "./StreamHub.scss";

export default function StreamHub() {
  return (
    <div className="streamhub row">
      <div className="streamhub-video col-md-6 col-12">
        <div className="video-layout">
          <ReactHlsPlayer
            src={`${process.env.REACT_APP_HLS_URL}/hello.m3u8`}
            autoPlay={false}
            controls={true}
            width="81%"
            height="50%"
          />
        </div>
      </div>
      <div className="col-md-6 global-chat">
        <ChatStream/>
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { Spin, Space } from "antd";
import Lottie from "react-lottie";
import "./Loading.scss";
import LoadingAnimation from "assets/8370-loading.json";

export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="loading">
      <Lottie options={defaultOptions} height={500} width={500} isClickToPauseDisabled={true} ></Lottie>
    </div>
  );
}

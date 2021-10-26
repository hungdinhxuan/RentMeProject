import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

export default function CoutdownTime({ expiredTime }) {
  const [time, setTime] = useState(0);
  const history = useHistory();

  // Function Convert Time
  const msToTime = (duration) => {
    var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  };
  let intervalRef = useRef();
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const distance =new Date(expiredTime).getTime() - new Date().getTime();
      setTime(msToTime(distance));
      if (distance < 0) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [time]);
  return <>{time}</>;
}

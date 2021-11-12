import React, { useEffect, useRef, useState } from "react";
import socket from 'utils/socket'



export default function CoutdownTime({ expiredTime, tradingId, path }) {

  const [time, setTime] = useState(0);
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
        socket.emit('done trading', tradingId, path)
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [time, expiredTime, tradingId, path]);
  return <>{time}</>;
}

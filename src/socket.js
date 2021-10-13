import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  extraHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  path: '/mysocket'
});

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});


socket.on("connect_error", () => {
  socket.connect();
});

export const socketContext = createContext();
// console.log('http://localhost:4000');


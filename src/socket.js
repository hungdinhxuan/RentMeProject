import { createContext } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  extraHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  path: '/mysocket'
});
console.log(`socket is running using ${localStorage.getItem("token")}`);
export const socketContext = createContext();
// console.log('http://localhost:4000');
export default socket;

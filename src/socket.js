import { createContext } from "react";
import { io } from "socket.io-client";



const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  extraHeaders: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  path: '/mysocket'
});

export const socketAuth = () => {
  socket.io.opts.extraHeaders = {
    'Authorization': `Bearer ${localStorage.getItem("token")}`
  }
  socket.io.connect()
  console.log('auth bearer');
}
export const socketContext = createContext();
// console.log('http://localhost:4000');
export default socket;

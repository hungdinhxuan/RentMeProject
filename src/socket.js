import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  path: "/mysocket",
});

socket.on("connect", () => {
  socket.emit("authenticate", localStorage.getItem("token"));
});

export default socket;

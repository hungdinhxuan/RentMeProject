import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  path: "/mysocket",
});

<<<<<<< HEAD
socket.on("connect", () => {
  socket.emit("authenticate", localStorage.getItem("token"));
});

export default socket;
=======
// Quan trọng: Chứng thực authentication và reconnect lại socket
export const socketAuth = () => {
  socket.io.opts.extraHeaders = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  socket.io.connect();
  console.log(`called socket connect with ${localStorage.getItem("token")}`);
};
export const socketContext = createContext();
>>>>>>> a2402c92580dd5f19a1f7895fde93057addb14c8

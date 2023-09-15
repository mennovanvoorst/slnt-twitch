import { io, Socket } from "socket.io-client";
import config from "@config";
import socketHandlers from "@sockets";

export default (): Socket => {
  const socket = io(config.server_url, {
    withCredentials: true
  });

  console.info("Socket.IO client has been initialized");

  socket.on("action", (action) => {
    const eventHandler = socketHandlers[action.type];

    if (eventHandler) {
      eventHandler({
        payload: action.payload
      });
    }
  });

  return socket;
};

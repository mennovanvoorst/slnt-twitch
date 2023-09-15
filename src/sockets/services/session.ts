import { Socket } from "socket.io-client";
import { Video } from "@interfaces/video";

export const joinSession = (socket: Socket, sessionId: number): void => {
  if (!sessionId) return;

  socket.emit("action", {
    type: "joinSession",
    payload: { sessionId }
  });
};

export const leaveSession = (socket: Socket, sessionId: number): void => {
  if (!sessionId) return;

  socket.emit("action", {
    type: "leaveSession",
    payload: { sessionId }
  });
};

export const addNewRequest = (
  socket: Socket,
  sessionId: number,
  video: Video
): void => {
  if (!sessionId) return;

  socket.emit("action", {
    type: "sessionAddSong",
    payload: { sessionId, video }
  });
};

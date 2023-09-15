import Message from "@models/message";
import { Client } from "tmi.js";
import { Socket } from "socket.io-client";

export interface CommandHandlers {
  [key: string]: (data) => void;
}

export interface CommandProps {
  client: Client;
  message: Message;
  socket: Socket;
}

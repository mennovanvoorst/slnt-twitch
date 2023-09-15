import config from "@config";
import { client as TwitchClient } from "tmi.js";

const connectionConfig = {
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: config.twitch.username,
    password: config.twitch.token
  },
  channels: ["slnt_dj"]
};

const client = new TwitchClient(connectionConfig);

export const joinChannel = (channel: string) => {
  setTimeout(() => client.join(channel), 300);
};

export const leaveChannel = (channel: string) => {
  client.part(channel);
};

export const sendMessage = (channel: string, message: string) => {
  client.say(channel, message);
};

export default client;

import { Message } from "@interfaces/message";
import message from "@models/message";
import { ChatUserstate } from "tmi.js";
import { getCache, setCache } from "@services/cache";
import config from "@config";

export const parseMessage = (
  msg: {
    user: number;
    channel: string;
    message: string;
    tags: ChatUserstate;
  },
  prefix: string
): Message => ({
  user: msg.user,
  message: msg.message,
  channel: message.channel(msg),
  sender: message.sender(msg),
  command: message.command(prefix, msg),
  send: new Date()
});

export const logMessage = async (msg: Message): Promise<void> => {
  const messages = (await message.get(msg.channel)) || [];

  /*if (messages.length >= config.messages.max_cached.length) {
    messages.shift();
  }*/

  await setCache(`messages:${msg.channel}`, [...messages, msg]);
};

export const getLoggedMessages = async (channel: string): Promise<Message[]> =>
  await getCache(`messages:${channel}`);

export const getLoggedMessagesByCommand = async (
  channel: string,
  command: string
): Promise<Message[]> => {
  const messages = await getCache(`messages:${channel}`);
  const filteredMessages = messages.filter(
    (message) => message.command.trigger === command
  );

  return filteredMessages;
};

import { Command, Message, Sender } from "@interfaces/message";
import { getCache } from "@services/cache";

const get = async (channel: string): Promise<Message[]> =>
  await getCache(`messages:${channel}`);

const channel = (message): string => message.channel.replace("#", "");

const sender = (message): Sender => {
  console.log(message.tags);
  return {
    username: message.tags.username,
    isMod: message.tags.mod,
    isSubscriber: message.tags.subscriber,
    isVip: message.tags.badges ? "vip" in message.tags.badges : false,
    isBroadcaster: message.tags.badges
      ? "broadcaster" in message.tags.badges
      : false
  };
};

const command = (prefix: string, message: any): Command => {
  const isCommand = message.message.indexOf(prefix) === 0;

  const parsedMessage = isCommand
    ? message.message.slice(prefix.length).trim().split(" ")
    : [];
  const command = isCommand ? parsedMessage.shift() : "";

  return {
    isCommand,
    trigger: command.toLowerCase(),
    args: parsedMessage
  };
};

export default {
  get,
  channel,
  sender,
  command
};

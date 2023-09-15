import { Settings } from "@interfaces/settings";
import settings from "@models/settings";
import { updateTimedMessages } from "@services/timedMessages";
import { joinChannel, leaveChannel } from "@services/twitch";
import { joinSession, leaveSession } from "../sockets/services/session";
import { Socket } from "socket.io-client";

export const updateSettings = async (
  socket: Socket,
  channel: string,
  channelId: number,
  userId: number,
  s: Settings
): Promise<void> => {
  await settings.save(channel, s);
  await updateTimedMessages(channel, s.settings.bot_timedmessages);

  if (s.settings.bot_enabled) {
    joinChannel(channel);
    joinSession(socket, userId);
  } else {
    leaveChannel(channel);
    leaveSession(socket, userId);
  }
};

export const getSettings = async (channel: string): Promise<any> =>
  await settings.get(channel);

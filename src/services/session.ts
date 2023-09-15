import { Session } from "@interfaces/session";
import session from "@models/session";
import { Message } from "@interfaces/message";
import { sendMessage } from "@services/twitch";
import { parse } from "@utils/content";
import { getSettings } from "@services/settings";
import {
  getLoggedMessages,
  getLoggedMessagesByCommand
} from "@services/message";
import { differenceInSeconds } from "date-fns";
import { isPlaylist, isVideo } from "@utils/youtube";
import { fetchVideo } from "@api/video";
import { Socket } from "socket.io-client";
import { addNewRequest } from "../sockets/services/session";

export const updateSession = async (ses: Session): Promise<void> =>
  await session.save(ses);

export const getSession = async (sessionId: string): Promise<Session> =>
  await session.get(sessionId);

export const sessionAddRequest = async (
  socket: Socket,
  ses: Session,
  message: Message
): Promise<void> => {
  if (!message.command.args || message.command.args.length === 0) {
    sendMessage(message.channel, parse("session.requestMissing"));
    return;
  }

  const settings = await getSettings(message.channel);
  const requestSettings = settings.settings.song_requests;

  let hasPermission = false;
  let curPermission = null;

  if (requestSettings.chat_enabled) {
    if (requestSettings.mode === "priority") {
      hasPermission = requestSettings.priority.some((priority) => {
        curPermission = priority;

        switch (priority) {
          case "vip":
            return message.sender.isVip;
          case "moderator":
            return message.sender.isMod;
          case "subscriber":
            return message.sender.isSubscriber;
          case "streamer":
            return message.sender.isBroadcaster;
          case "viewer":
            return true;
        }
      });
    }
  }

  if (!hasPermission) {
    sendMessage(message.channel, parse("session.requestDisabled"));
    return;
  }

  let requests = await getLoggedMessagesByCommand(message.channel, "sr");

  requests.pop();

  requests = requests.filter(
    (request) => request.sender.username === message.sender.username
  );

  const lastRequest = requests.at(-1);
  const timeBetweenRequests = lastRequest
    ? differenceInSeconds(new Date(), lastRequest.send)
    : 0;
  const timeout = requestSettings.cooldown[curPermission];

  if (timeout > 0 && timeBetweenRequests && timeBetweenRequests <= timeout) {
    const params = {
      user: message.sender.username,
      seconds: timeout - timeBetweenRequests
    };

    sendMessage(message.channel, parse("session.requestLimit", params));
    return;
  }

  const videoId = isVideo(message.command.args[0]);

  if (!videoId) {
    sendMessage(message.channel, parse("session.requestInvalid"));
    return;
  }

  const res = await fetchVideo(videoId);

  if (!res.success) {
    sendMessage(message.channel, parse("session.requestFailed"));
    return;
  }

  const video = res.payload;
  video.priority = curPermission;

  addNewRequest(socket, ses.hosts[0], video);
  sendMessage(
    message.channel,
    parse("session.requestAdded", {
      title: video.title,
      channel: video.channel
    })
  );
};

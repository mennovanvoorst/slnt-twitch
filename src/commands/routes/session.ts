import { CommandProps } from "@interfaces/commands";
import { parse } from "@utils/content";
import { getSession, sessionAddRequest } from "@services/session";

const sessionLink = async ({
  client,
  message
}: CommandProps): Promise<void> => {
  if (!client) return;

  const session = await getSession(message.user);

  if (!session || !session.isActive) {
    await client.say(
      message.channel,
      parse("session.inactive", { channel: message.channel })
    );

    return;
  }

  await client.say(
    message.channel,
    parse("session.link", { sessionId: message.user })
  );
};

const currentSong = async ({
  client,
  message
}: CommandProps): Promise<void> => {
  if (!client) return;

  const session = await getSession(message.user);

  if (!session || !session.isActive) {
    await client.say(
      message.channel,
      parse("session.inactive", { channel: message.channel })
    );

    return;
  }

  const video = session.playlist[0];

  if (video)
    await client.say(
      message.channel,
      parse("session.nowPlaying", {
        title: video.title,
        channel: video.channel
      })
    );
  else await client.say(message.channel, parse("session.nothingPlaying"));
};

const addRequest = async ({
  socket,
  client,
  message
}: CommandProps): Promise<void> => {
  if (!client) return;

  const session = await getSession(message.user);

  if (!session) {
    await client.say(
      message.channel,
      parse("session.inactive", { channel: message.channel })
    );
    return;
  }

  await sessionAddRequest(socket, session, message);
};

export default {
  session: sessionLink,
  song: currentSong,
  sr: addRequest,
  songrequest: addRequest
};

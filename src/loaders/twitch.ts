import client, { joinChannel } from "@services/twitch";
import { fetchChannels } from "@api/settings";
import { fetchSettings, fetchUsers } from "@api/user";
import { getUser, updateUser } from "@services/user";
import { joinSession } from "../sockets/services/session";
import { Socket } from "socket.io-client";
import { getSettings, updateSettings } from "@services/settings";
import { logMessage, parseMessage } from "@services/message";
import { CommandProps } from "@interfaces/commands";
import CommandHandlers from "@commands";

export default ({ socket }: { socket: Socket }): void => {
  client.connect().catch(console.error);

  client.on("connected", async (addr, port) => {
    const channels = await fetchChannels();
    const users = await fetchUsers(
      channels.payload.map((channel) => channel.user_id)
    );

    await Promise.all(
      users.payload.map(async (user) => {
        await updateUser(user);

        const settings = await fetchSettings(user.id);

        setTimeout(async () => {
          await updateSettings(
            socket,
            user.providers.twitch.displayName,
            user.providers.twitch.id,
            user.id,
            settings.payload
          );
        }, 600);
      })
    );

    client.on("message", async (channel, tags, msg, self) => {
      const channelName = channel.replace("#", "");
      const settings = await getSettings(channelName);

      const parsedMessage = parseMessage(
        {
          channel,
          user: settings.user_id,
          message: msg,
          tags
        },
        settings.settings.bot_prefix
      );

      await logMessage(parsedMessage);

      if (self) return;

      console.log(parsedMessage);
      if (parsedMessage.command.isCommand) {
        const eventHandler: (data: CommandProps) => void =
          CommandHandlers[parsedMessage.command.trigger];

        const customEventHandler: (data: CommandProps) => void =
          CommandHandlers.custom;

        if (eventHandler && typeof eventHandler === "function")
          eventHandler({ client, socket, message: parsedMessage });
        else if (customEventHandler && typeof customEventHandler === "function")
          customEventHandler({
            client,
            socket,
            message: parsedMessage
          });
      }
    });

    console.log("Connected to Twitch");
  });
};

import { CommandProps } from "@interfaces/commands";
import { getSettings } from "@services/settings";

const custom = async ({ client, message }: CommandProps): Promise<void> => {
  if (!client) return;

  const commands = await getSettings(message.channel);
  const event = commands.settings.bot_commands.find(
    (c) => c.trigger === message.command.trigger
  );

  if (!event || !event.enabled) return;

  client.say(message.channel, event.message);
};

export default {
  custom
};

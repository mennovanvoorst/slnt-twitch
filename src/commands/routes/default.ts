import { CommandProps } from "@interfaces/commands";
import { parse } from "@utils/content";

const explain = async ({ client, message }: CommandProps): Promise<void> => {
  if (!client) return;

  await client.say(message.channel, parse("slnt.about"));
};

const extension = async ({ client, message }: CommandProps): Promise<void> => {
  if (!client) return;

  await client.say(message.channel, parse("slnt.extension"));
};

const commands = async ({ client, message }: CommandProps): Promise<void> => {
  if (!client) return;

  await client.say(message.channel, parse("slnt.commands"));
};

export default {
  slnt: explain,
  extension,
  commands,
  help: commands
};

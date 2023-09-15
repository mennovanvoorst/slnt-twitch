import { TimedMessage } from "@interfaces/timedMessage";
import cron, { ScheduledTask } from "node-cron";
import { getCache } from "@services/cache";
import messageModel from "@models/message";
import { sendMessage } from "@services/twitch";
import timedMessage from "@models/timedMessage";

export const updateTimedMessages = async (
  channel: string,
  messages: TimedMessage[]
): Promise<void> => {
  let cronjobs: ScheduledTask[] = (await timedMessage.get(channel)) || [];

  if (cronjobs && cronjobs.length > 0) {
    cronjobs.forEach((job) => {
      job.stop();
    });

    cronjobs = [];
  }

  for (const timedMessage of messages) {
    const { enabled, messages_between, interval, message } = timedMessage;

    if (!enabled) continue;

    const intervalTime =
      interval > 60 ? `* */${interval / 60} * * *` : `*/${interval} * * * *`;

    const job = cron.schedule(intervalTime, async () => {
      const chatMessages = (await messageModel.get(channel)) || [];
      const lastMessagesFromLog = chatMessages.slice(-messages_between);

      if (
        lastMessagesFromLog.filter((msg: any) => msg.message === message)
          .length > 0
      )
        return;

      sendMessage(channel, message);
    });

    cronjobs = [...cronjobs, job];
  }

  await timedMessage.save(channel, cronjobs);
};

import { User } from "@interfaces/user";
import { getCache, setCache } from "@services/cache";

const save = async (user: User): Promise<void> =>
  await setCache(`user:${user.providers.twitch.displayName}`, user);

const get = async (channelName: string): Promise<User> =>
  await getCache(`user:${channelName}`);

export default {
  save,
  get
};

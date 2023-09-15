import user from "@models/user";
import { User } from "@interfaces/user";

export const updateUser = async (usr: User): Promise<void> =>
  await user.save(usr);

export const getUser = async (channelName: string): Promise<User> =>
  await user.get(channelName);

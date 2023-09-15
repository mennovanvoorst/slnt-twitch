import { Application } from "express";
import { Server } from "http";
import expressLoader from "./express";
import twitchLoader from "./twitch";
import socketioLoader from "./socketio";

export default async ({
  expressApp
}: {
  expressApp: Application;
}): Promise<{ server: Server }> => {
  const socket = await socketioLoader();
  await twitchLoader({ socket });
  const server: Server = await expressLoader({
    app: expressApp,
    socket
  });

  return { server };
};

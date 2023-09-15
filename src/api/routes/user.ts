import { Router } from "express";
import { updateSettings } from "@services/settings";
import { Socket } from "socket.io-client";

const route = Router();

export default (app: Router, socket: Socket): void => {
  app.use("/v1/user", route);

  route.post("/settings", async (req, res) => {
    const { channelName, channelId, settings, userId } = req.body;

    await updateSettings(socket, channelName, channelId, userId, { settings });

    return res.sendStatus(200);
  });
};

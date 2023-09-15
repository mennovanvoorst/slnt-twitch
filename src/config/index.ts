import dotenv from "dotenv";
import { Config } from "@interfaces/config";

dotenv.config();

const config: Config = {
  app_url: process.env.APP_URL as string,
  server_url: process.env.SERVER_URL as string,
  port: process.env.NODE_PORT as string,

  api: {
    prefix: process.env.API_PREFIX as string
  },

  twitch: {
    username: process.env.BOT_USERNAME as string,
    token: process.env.OAUTH_TOKEN as string,
    channel: process.env.CHANNEL_NAME as string
  },

  messages: {
    max_cached: process.env.MAX_MESSAGES as unknown as number
  }
};

export default config;

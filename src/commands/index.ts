import { CommandHandlers } from "@interfaces/commands";
import defaultHandler from "./routes/default";
import sessionHandler from "./routes/session";
import customHandler from "./routes/custom";

const handlers: CommandHandlers = {
  ...defaultHandler,
  ...sessionHandler,
  ...customHandler
};

export default handlers;

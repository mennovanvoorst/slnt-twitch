export interface Message {
  message: string;
  user: number;
  channel: string;
  sender: Sender;
  command: Command;
  send: Date;
}

export interface Sender {
  username: string;
  isMod: boolean;
  isSubscriber: boolean;
  isVip: boolean;
  isBroadcaster: boolean;
}

export interface Command {
  isCommand: boolean;
  trigger: string;
  args: string[];
}

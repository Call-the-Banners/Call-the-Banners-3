import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable, TextBasedChannel } from "discord.js";
import { client } from "..";
import { warChannelFilter } from "../utils";

export default class extends Command {
  name = "stage";
  description =
    "!stage sets battle stage, there are 'ready', 'start', 'end'. EX)!stage start";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {
    warChannelFilter(msg.channel.id);
    const state = args[0];

    if (!state) {
      throw new Error(
        "you need to pass stage, 'ready', 'start', 'end', 'pause', 'unpause'"
      );
    }

    client.battleStage.setStage(msg.channel as TextBasedChannel, state);
    client.battleStage.save();

    msg.channel.send(`Successfully set stage to ${client.battleStage.stage}`);
  }
}

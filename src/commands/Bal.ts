import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { Player } from "../structure/Player";
import { warChannelFilter } from "../utils";

export default class extends Command {
  name = "bal";
  description = "show player's balance";

  async exec(msg: Message) {
    warChannelFilter(msg.channel.id);
    const player = Player.fromUser(msg.author);
    msg.channel.send(`You have a balance of ${bold(player.coins)} coins`);
  }
}

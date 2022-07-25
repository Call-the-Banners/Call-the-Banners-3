import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message, PermissionResolvable } from "discord.js";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "give";
  description = "give player coin";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {

    const amountStr = args[0];
    const amount = parseInt(amountStr);

    if (!amountStr) {
      throw new Error("you need to give an amount");
    } else if (isNaN(amount)) {
      throw new Error("invalid amount");
    }

    const user = msg.mentions.users.first();

    if (!user) {
      throw new Error("you need to mention a user");
    }

    const player = Player.fromUser(user);

    player.coins += amount;
    player.save();

    msg.channel.send(`Successfully gave ${bold(amount)} coins to ${bold(player.name)}`);

  }
}

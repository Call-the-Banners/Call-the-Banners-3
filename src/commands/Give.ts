import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message, PermissionResolvable } from "discord.js";
import { Player } from "../structure/Player";
import { warChannelFilter } from "../utils";

export default class extends Command {
  name = "give";
  description = "!give give player coin. EX)!give <coin amount> @User";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {
    warChannelFilter(msg.channel.id);
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

    msg.channel.send(
      `Successfully gave ${bold(amount)} coins to ${bold(player.name)}`
    );
  }
}

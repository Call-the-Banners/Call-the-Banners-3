import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { warChannelFilter } from "../utils";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "givecoin";
  description =
    "!givecoin Give coin to general (Admin only). !givecoin @user <coin amount>";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {
    warChannelFilter(msg.channel.id);
    const mentionedMember = msg.mentions.members?.first();

    if (!mentionedMember) {
      throw new Error("you need to mention a user");
    }
    const coinAmount = parseInt(args[1]);
    if (isNaN(coinAmount)) {
      throw new Error("invalid amount");
    }

    const player = Player.fromUser(mentionedMember.user);

    player.coins += coinAmount;
    player.save();

    msg.channel.send(`Successfully give ${coinAmount} coin to ${player.name}`);
  }
}

import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { Castle } from "../structure/Castle";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "assign";
  description = "assign player as General (admin only)";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {

    const mentionedMember = msg.mentions.members?.first();

    if (!mentionedMember) {
      throw new Error("you need to mention a user");
    }
    
    const castleName = args[1];
    const castle = Castle.fromName(castleName);
    const player = Player.fromUser(mentionedMember.user);


    player.role = "general";

    // remove previous general of the castle
    castle.removeGeneral();

    castle.generalID = player.id;
    
    player.save();
    castle.save();

    msg.channel.send(`Successfully set ${player.name} as General to ${castleName}`);
  }
}

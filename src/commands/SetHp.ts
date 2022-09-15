import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { warChannelFilter } from "../utils";
import { Castle } from "../structure/Castle";
import { client } from "..";

export default class extends Command {
  name = "sethp";
  description = "!sethp Set castle initial hp. !sethp <CastleName> <CastleHP>";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {
    warChannelFilter(msg.channel.id);
    if (client.battleStage.stage !== "ready") {
      throw new Error(
        "you can only set castle hp when the stage is on ready stage"
      );
    }
    const castleName = args[0];
    const castleInitialHp = parseInt(args[1]);

    if (!castleName) {
      throw new Error(`you need to mention a castle`);
    } else if (!castleInitialHp) {
      throw new Error(`you need to give amount of hp`);
    }

    const castle = Castle.fromName(castleName);

    castle.hp = castleInitialHp;
    castle.initialhp = castleInitialHp;
    castle.maxhp = castleInitialHp * 1.5;
    castle.save();

    msg.channel.send(`Successfully set ${castle.name} hp to ${castle.hp}`);
  }
}

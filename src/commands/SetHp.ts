import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { botCommandChannelFilter } from "../utils";
import { Castle } from "../structure/Castle";
import { client } from "..";

export default class extends Command {
  name = "sethp";
  description = "!sethp Set castle initial hp. !sethp <CastleName> <CastleHP>";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message, args: string[]) {
    botCommandChannelFilter(msg.channel.id);
    console.log(client.battleStage.stage !== "ready");
    console.log(client.battleStage.stage !== "start");
    if (
      client.battleStage.stage !== "ready" &&
      client.battleStage.stage !== "start"
    ) {
      throw new Error(
        "you can only set castle hp when the stage is on ready or start stage"
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

    castle.hp =
      (castleInitialHp / 100) * ((castle.hp / castle.initialhp) * 100);
    castle.initialhp = castleInitialHp;
    castle.maxhp = castleInitialHp * 1.5;
    castle.save();

    msg.channel.send(`Successfully set ${castle.name} hp to ${castle.hp}`);
  }
}

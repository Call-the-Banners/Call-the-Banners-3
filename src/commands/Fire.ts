import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { client } from "..";
import { Castle } from "../structure/Castle";
import { Player } from "../structure/Player";
import { botCommandChannelFilter } from "../utils";

export default class extends Command {
  name = "fire";
  description = "!fire fire ballista. EX)!fire south";

  async exec(msg: Message, args: string[]) {
    botCommandChannelFilter(msg.channel.id);
    if (client.battleStage.stage !== "start") {
      throw new Error("you can only fire when battle starts");
    }

    const castleName = args[0];

    if (!castleName) {
      throw new Error("you need to specify which castle");
    }

    const player = Player.fromUser(msg.author);
    const castle = Castle.fromName(castleName);
    const ownCastle = Castle.fromName(Castle.castleNameConverter(castleName));
    const general = castle.general;
    if (!general) {
      throw new Error(`castle ${castle.name} has not been assigned a general`);
    }

    if (player.id === general.id) {
      throw new Error("You cannot attack your own castle");
    }

    if (player.id != ownCastle.generalID) {
      throw new Error("You are not general");
    }

    const loadData = client.loadHistory.fireLoad(ownCastle.name);

    const attack = loadData.final;
    if (attack && loadData.playerID) {
      castle.hp -= attack;
      const attackAvg = attack / loadData.playerID?.length;
      castle.save();

      loadData.playerID?.forEach((id) => {
        client.strikeHistory.addStrike({
          playerID: id,
          damage: attackAvg,
          castleID: castle.id,
          date: new Date(),
        });
      });
      msg.channel.send(
        `Ballista damaged ${bold(castle.name)} for ${bold(attack)} damage!`
      );
    }
  }
}

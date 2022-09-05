import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { client } from "..";
import { Castle } from "../structure/Castle";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "aim";
  description = "load ballista";

  async exec(msg: Message, args: string[]) {
    if (client.battleStage.stage !== "start") {
      throw new Error("you can only load when battle starts");
    }

    const castleName = args[0];
    const player = Player.fromUser(msg.author);

    // if (player.id === Castle.castleA.generalID || player.id === Castle.castleB.generalID) {
    //   throw new Error("General cannot load ballista");
    // }

    // if (player.isOnCooldown()) {
    //   throw new Error(`Please wait for ${bold(player.timeLeft())}`);
    // }

    if (!castleName) {
      throw new Error("you need to specify which castle");
    }

    const castle = Castle.fromName(Castle.castleNameConverter(castleName));
    const general = castle.general;

    if (!general) {
      throw new Error(`castle ${castle.name} has not been assigned a general`);
    }

    const attack = player.aim();

    client.loadHistory.addLoad(
      {
        castle: castle.name,
        date: new Date(),
      },
      player.id,
      attack
    );

    player.lastAttack = new Date();
    player.save();

    msg.channel.send("Successfully loaded!");
  }
}

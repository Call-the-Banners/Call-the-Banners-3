import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { client } from "..";
import { Castle } from "../structure/Castle";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "attack";
  description = "attack castle";

  async exec(msg: Message, args: string[]) {

    if (client.battleStage.stage !== "start") {
      throw new Error("you can only attack when battle starts");
    }

    const castleName = args[0];

    if (!castleName) {
      throw new Error("you need to specify which castle");
    }

    const castle = Castle.fromName(castleName);
    const general = castle.general;

    if (!general) {
      throw new Error(`castle ${castle.name} has not been assigned a general`);
    }

    const player = Player.fromUser(msg.author);

    if (player.isOnCooldown()) {
      throw new Error(`Please wait for ${bold(player.timeLeft())}`);
    }

    if (player.id === general.id) {
      throw new Error("You cannot attack your own castle");
    }

    const attack = player.attack();

    castle.hp -= attack;
    castle.save();

    client.strikeHistory.addStrike({ 
      playerID: player.id, 
      damage: attack, 
      castleID: castle.id,
      date: new Date(),
    });

    client.strikeHistory.save();

    player.strikeCount++;

    if (castle.hp > 0) {

      player.lastAttack = new Date();
      player.save();

      msg.channel.send(
        `${bold(player.name)} attacked ${bold(castleName)} for ${bold(attack)} damage!`
      );

    } else {


      msg.channel.send(`${bold(castleName)} has fallen!`);

      const winCastle = Castle.castleA.id === castle.id ? Castle.castleB : Castle.castleA;
      msg.channel.send(`${bold(winCastle.name)} won the battle!`);


      player.coins += Castle.FATAL_BLOW_REWARD;

      player.save();

      client.battleStage.setEndStage(msg.channel);

    }
    
  }
}

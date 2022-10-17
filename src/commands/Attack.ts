import { Command } from "@jiman24/commandment";
import { bold } from "@jiman24/discordjs-utils";
import { Message, MessageEmbed } from "discord.js";
import { client } from "..";
import { Castle } from "../structure/Castle";
import { Player } from "../structure/Player";
import { getCastleImage } from "../utils";
import { botCommandChannelFilter } from "../utils";

export default class extends Command {
  name = "attack";
  description = "!attack attack castle. EX)!attack north";

  async exec(msg: Message, args: string[]) {
    botCommandChannelFilter(msg.channel.id);
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

    const battled = client.strikeHistory.current.filter(
      (strike) => strike.playerID === player.id
    );

    if (battled.length === 1) {
      player.battleCount++;
    }

    const isStrongStrike = attack >= 95;
    const isWeakStrike = attack <= 55;

    player.lastAttack = new Date();
    player.save();

    if (isStrongStrike || isWeakStrike) {
      const strikeImage = isWeakStrike
        ? "https://cdn.discordapp.com/attachments/982462379449282613/1011100466630893628/Weakstrike.jpg"
        : "https://cdn.discordapp.com/attachments/982462379449282613/1011100466291150858/Strongstrike.jpg";

      const embed = new MessageEmbed()
        .setTitle(
          `${bold(player.name)} attacked ${bold(castleName)} for ${bold(
            attack
          )} damage!`
        )
        .setDescription(
          isStrongStrike
            ? "Huzzah! A devastating blow to the enemy"
            : "Do I need to remind you there is a war going on? Put some umph into it!"
        )
        .setImage(strikeImage);
      this.sendEmbed(msg, embed);
    } else {
      msg.channel.send(
        `${bold(player.name)} attacked ${bold(castleName)} for ${bold(
          attack
        )} damage!`
      );
    }

    /**
     * Round ended when hp fall below 0
     */
    if (castle.hp <= 0) {
      const attachment = await getCastleImage(
        castle.hp,
        castle.initialhp,
        castle.id
      );
      msg.channel.send(`${bold(castleName)} has fallen!`);
      msg.channel.send({ files: [attachment] });
      const winCastle =
        Castle.castleA.id === castle.id ? Castle.castleB : Castle.castleA;
      msg.channel.send(`${bold(winCastle.name)} won the battle!`);

      player.coins += Castle.FATAL_BLOW_REWARD;

      player.save();

      client.battleStage.setEndStage(msg.channel);
    }
  }
}

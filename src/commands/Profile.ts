import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { client } from "..";
import { bold } from "@jiman24/discordjs-utils";
import { decimalCheck } from "../utils";

export default class extends Command {
  name = "profile";
  description = "show player's profile";

  async exec(msg: Message) {
    const player = Player.fromUser(msg.author);

    // User data
    const [role, coins, strikeHistory, strikes] = [
      player.role === "general" ? "General" : `Sword ${player.minAttack}`,
      player.coins,
      client.strikeHistory.allTime.filter((x) => x.playerID === player.id),
      client.strikeHistory.current.filter((x) => x.playerID === player.id),
    ];

    // Calculated value for battle stats
    const numberOfStrikesAllTime = strikeHistory.length;
    const lifeTimeGrossAttack = strikeHistory.reduce(
      (acc, x) => acc + x.damage,
      0
    );
    const averageDamage = lifeTimeGrossAttack / numberOfStrikesAllTime || 0;
    const totalDamageDealtInStage = strikes.reduce(
      (acc, x) => acc + x.damage,
      0
    );
    const avgDamageDealtInStage = totalDamageDealtInStage / strikes.length;

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Profile")
      .setThumbnail(`${msg.author.avatarURL()}`)
      .setDescription(
        `${bold(`${player.name}`)}\nCoins: ${coins}\nRank: ${role}`
      )
      .addFields(
        {
          name: "BATTLE STATS",
          value: `# of Strikes: ${
            strikes.length
          }\n Total HP Dealt: ${totalDamageDealtInStage}\n Average HP Dealt: ${decimalCheck(
            avgDamageDealtInStage,
            2
          )}`,
        },
        {
          name: "LIFETIME STATS",
          value: `Biggest Strike: ${player.maxAttack}\n Lowest Strike: ${
            player.minAttack
          }\n Lifetime Average: ${decimalCheck(averageDamage, 2)}`,
        }
      );

    msg.channel.send({ embeds: [embed] });
  }
}

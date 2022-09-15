import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { client } from "..";
import { decimalCheck, botCommandChannelFilter } from "../utils";

export default class extends Command {
  name = "profile";
  description = "!profile show player's profile. EX)!profile or !profile @User";

  async exec(msg: Message, _args: string[]) {
    botCommandChannelFilter(msg.channel.id);

    const user = msg.mentions.members?.first()?.user || msg.author;
    const player = Player.fromUser(user);
    const thumbnail = user.avatarURL();

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
      .setTitle(`Profile (${player.name})`)
      .setThumbnail(
        `${
          thumbnail ||
          "https://w7.pngwing.com/pngs/304/275/png-transparent-user-profile-computer-icons-profile-miscellaneous-logo-monochrome-thumbnail.png"
        }`
      )
      .setDescription(`Coins: ${coins}\nRank: ${role}`)
      .addFields([
        ...(strikes.length > 0
          ? [
              {
                name: "Battle Stats",
                value: `# of Strikes: ${strikes.length}
                Total HP Dealt: ${totalDamageDealtInStage}
                Average HP Dealt: ${decimalCheck(avgDamageDealtInStage, 2)}`,
              },
            ]
          : []),
        ...(numberOfStrikesAllTime > 0
          ? [
              {
                name: "Lifetime Stats",
                value: `Lifetime Average: ${decimalCheck(averageDamage, 2)}
              # of Strikes Lifetime: ${numberOfStrikesAllTime}
              ${
                player.battleCount ? "# of battles: " + player.battleCount : ""
              }`,
              },
            ]
          : []),
      ]);

    msg.channel.send({ embeds: [embed] });
  }
}

import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { client } from "..";
import { bold, cap, toNList } from "@jiman24/discordjs-utils";

export default class extends Command {
  name = "profile";
  description = "show player's profile";

  private decimalCheck<T>(num: number) {
    return (num).toFixed(2).replace(/[.,]00$/, "")
  }

  async exec(msg: Message) {
    const player = Player.fromUser(msg.author);
    const role = player.role === "general" ? "General" : `Sword ${player.minAttack}`;
    const coins = player.coins;
    const strikeHistory = client.strikeHistory.allTime
    .filter(x => x.playerID === player.id);
    const numberOfStrikesAllTime = strikeHistory.length;
    const lifeTimeGrossAttack = strikeHistory.reduce((acc, x) => acc + x.damage, 0);
    let averageDamage = lifeTimeGrossAttack / numberOfStrikesAllTime;
    if (Number.isNaN(averageDamage)) {
      averageDamage = 0;
    }
    //Battle Stats
    const strikes = client.strikeHistory.current
    .filter(x => x.playerID === player.id);
    const totalDamageDealtInStage = strikes.reduce((acc, x) => acc + x.damage, 0);
    const avgDamageDealtInStage = totalDamageDealtInStage/strikes.length;

    const embed = new MessageEmbed();
    embed.setColor("RANDOM");
    embed.setTitle("Profile");
    embed.setThumbnail(`${msg.author.avatarURL()}`);
    embed.setDescription(bold(`${player.name}`)+"\nCoins: "+`${coins}`+"\nRank: "+`${role}`);
    embed.addFields(
      { name: 'BATTLE STATS', 
      value: '# of Strikes: '+`${strikes.length}`+
      '\n Total HP Dealt: '+`${totalDamageDealtInStage}`+
      '\n Average HP Dealt: '+`${this.decimalCheck(avgDamageDealtInStage)}` },
      { name: 'LIFETIME STATS', 
      value: 'Biggest Strike: '+`${player.maxAttack}`+
      '\n Lowest Strike: '+`${player.minAttack}`+
      '\n Lifetime Average: '+`${this.decimalCheck(averageDamage)}`},
    );
    msg.channel.send({ embeds: [embed] });
  }
}

import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { client } from "..";

export default class extends Command {
  name = "profile";
  description = "show player's profile";

  async exec(msg: Message) {
    const player = Player.fromUser(msg.author);
    // console.log(player)
    const role = player.role === "general" ? "General" : `Sword ${player.minAttack}`;
    const coins = player.coins
    //lifetime stats
    //biggest strike = player.maxAttack
    //lowest strike = player.minAttack
    const strikeHistory = client.strikeHistory.allTime
    .filter(x => x.playerID === player.id);
    const numberOfStrikesAllTime = strikeHistory.length;
    const lifeTimeGrossAttack = strikeHistory.reduce((acc, x) => acc + x.damage, 0);
    let averageDamage = lifeTimeGrossAttack / numberOfStrikesAllTime;
    if (Number.isNaN(averageDamage)) {
      averageDamage = 0;
    }
    console.log(averageDamage)

    const embed = new MessageEmbed()
    embed.setColor("RANDOM")
    embed.setTitle("Profile")
    embed.setThumbnail(`${msg.author.avatarURL()}`)
    embed.setDescription("TEST")

    msg.channel.send({ embeds: [embed] });
  }
}

import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { client } from "..";

export default class extends Command {
  name = "leaderboard";
  description = "show player leaderboard";

  async exec(msg: Message) {

    const players = client.players.array()
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10)
      .map((x, i) => `${i + 1}. ${x.name} ${x.coins}`);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Leaderboard")
      .setDescription(`Name | Coins\n${players.join("\n")}`);

    msg.channel.send({ embeds: [embed] });
  }
}

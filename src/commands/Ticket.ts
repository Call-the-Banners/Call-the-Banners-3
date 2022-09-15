import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { warChannelFilter } from "../utils";

export default class extends Command {
  name = "ticket";
  description = "!ticket show all available tickets you own. EX)!ticket";

  async exec(msg: Message) {
    warChannelFilter(msg.channel.id);
    const player = Player.fromUser(msg.author);
    const tickets = player.tickets.map((x, i) => `${i + 1}. #${x.id}`);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Tickets")
      .setDescription(tickets.join("\n"));

    msg.channel.send({ embeds: [embed] });
  }
}

import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "ticket";
  description = "show all available tickets you own";

  async exec(msg: Message) {

    const player = Player.fromUser(msg.author);
    const tickets = player.tickets.map((x, i) => `${i + 1}. #${x.id}`);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Tickets")
      .setDescription(tickets.join("\n"))

    msg.channel.send({ embeds: [embed] });

  }
}

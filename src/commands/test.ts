import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { castleStatus } from "../utils";

export default class extends Command {
  name = "test";
  description = "image test";

  async exec(msg: Message) {
    const attachment = await castleStatus(0, 100, "south");

    const embed = new MessageEmbed().setDescription(
      "Xytro Dealt 250 Damage to South Castle"
    );

    msg.channel.send({ embeds: [embed], files: [attachment] });
  }
}

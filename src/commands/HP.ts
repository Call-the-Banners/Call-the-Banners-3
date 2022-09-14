import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Castle } from "../structure/Castle";
import { getCastleImage, warChannelFilter } from "../utils";

export default class extends Command {
  name = "hp";
  description = "show castle's HP";

  async exec(msg: Message, args: string[]) {
    warChannelFilter(msg.channel.id);
    const castleName = args[0];

    if (!castleName) {
      throw new Error("please specify which castle");
    }

    const castle = Castle.fromName(castleName);

    const attachment = await getCastleImage(
      castle.hp,
      castle.initialhp,
      castle.id
    );

    const embed = new MessageEmbed()
      .setDescription(`${castle.name}'s HP: ${castle.hp}`)
      .setImage("attachment://castle.png");

    msg.reply({ embeds: [embed], files: [attachment] });
  }
}

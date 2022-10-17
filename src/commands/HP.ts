import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Castle } from "../structure/Castle";
import { getCastleImage, botCommandChannelFilter } from "../utils";

export default class extends Command {
  name = "hp";
  description = "!hp show castle's HP. EX)!hp south";

  async exec(msg: Message, args: string[]) {
    botCommandChannelFilter(msg.channel.id);
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

    const percentage = (castle.hp / castle.initialhp) * 100;

    const embed = new MessageEmbed()
      .setDescription(`${castle.name}'s HP: ${percentage}%`)
      .setImage("attachment://castle.png");

    msg.reply({ embeds: [embed], files: [attachment] });
  }
}

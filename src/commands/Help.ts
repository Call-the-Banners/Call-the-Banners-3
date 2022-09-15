import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../index";
import { botCommandChannelFilter } from "../utils";

export default class Help extends Command {
  name = "help";
  aliases = ["h"];
  description = "show all commands and it's description";

  async exec(msg: Message) {
    botCommandChannelFilter(msg.channel.id);
    const commands = client.commandManager.commands.values();

    let helpText = "";
    const done = new Set<string>();

    for (const command of commands) {
      if (command.disable) continue;

      if (done.has(command.name)) {
        continue;
      } else {
        done.add(command.name);
      }

      helpText += `\n**${command.name}**: \`${command.description || "none"}\``;
    }

    const embed = new MessageEmbed().setTitle("Help").setDescription(helpText);

    msg.channel.send({ embeds: [embed] });
  }
}

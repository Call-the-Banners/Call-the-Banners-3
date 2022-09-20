import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed, PermissionResolvable } from "discord.js";
import { client } from "../index";
import { botCommandChannelFilter } from "../utils";

export default class Help extends Command {
  name = "adminhelp";
  description = "show all admin commands and it's description";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {
    const commands = client.commandManager.commands.values();

    let helpText = "";
    const done = new Set<string>();

    for (const command of commands) {
      if (command.disable || !command.permissions.includes("ADMINISTRATOR"))
        continue;

      if (done.has(command.name)) {
        continue;
      } else {
        done.add(command.name);
      }

      helpText += `\n**${command.name}**: \`${command.description || "none"}\``;
    }

    const embed = new MessageEmbed()
      .setTitle("Administrator Help")
      .setDescription(helpText);

    msg.channel.send({ embeds: [embed] });
  }
}

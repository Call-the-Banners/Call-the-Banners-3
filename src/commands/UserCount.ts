import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";

export default class extends Command {
  name = "usercount";
  description = "check how many user joined war";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {
    const roleCollection = msg.member?.guild.roles.valueOf();
    if (!roleCollection) {
      return;
    }
    const role = roleCollection.find((role) => role.name === "Warrior");
    if (role) {
      msg.channel.send(`User that joined war: ${role.members.size}`);
    }
  }
}

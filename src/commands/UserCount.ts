import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";

export default class extends Command {
  name = "usercount";
  description =
    "!usercount check how many user joined war (Admin only). EX)!usercount";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(message: Message) {
    const role = await message.guild?.roles.fetch(
      process.env.ENLISTED_ROLE_ID || ""
    );

    if (role) {
      message.channel.send(`User that joined war: ${role.members.size}`);
    }
  }
}

import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { warChannelFilter } from "../utils";

export default class extends Command {
  name = "test";
  description = "test";

  async exec(msg: Message) {
    const roleCollection = msg.member?.guild.roles.valueOf();
    if (!roleCollection) {
      return;
    }
    const role = roleCollection.find((role) => role.name === "Warrior");
    if (role) {
      msg.channel.send(`Size: ${role.members.size}`);
    }
  }
}

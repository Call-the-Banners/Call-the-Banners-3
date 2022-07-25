import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { client } from "..";

export default class extends Command {
  name = "settime";
  description = "sets cooldown period (in hours)";

  async exec(msg: Message, args: string[]) {

    const role = args[0];
    const amountStr = args[1];
    const amount = parseInt(amountStr);

    if (!role) {
      throw new Error("you need to specify which role: sword, general");
    } else if (role !== "general" && role !== "sword") {
      throw new Error("invalid role");
    } else if (!amountStr) {
      throw new Error("you need to give time (in hours)");
    } else if (isNaN(amount)) {
      throw new Error("invalid time");
    } else if (amount < 0) {
      throw new Error("time cannot be less than zero");
    }

    if (role === "general") {
      client.settings.generalCooldown = amount;
    } else if (role === "sword") {
      client.settings.swordsCooldown = amount;
    }

    msg.channel.send(`Successfully set ${role} cooldown to ${amount} hours`);
    client.settings.save();

  }
}

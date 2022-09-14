import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { enlistChannelFilter } from "../utils";
import Web3 from "web3";
import { client } from "..";

export default class extends Command {
  name = "enlist";
  description = "add your eth address to join war";

  async exec(msg: Message, args: string[]) {
    enlistChannelFilter(msg.channel.id);
    if (!args[0]) {
      throw new Error("Please key in your eth address!");
    }
    if (!Web3.utils.isAddress(args[0])) {
      throw new Error("This is not an eth address!");
    }

    client.ethAddress.addEth(args[0]);

    const role = msg.member?.guild.roles.cache.find(
      (role) => role.name === "Warrior"
    );
    if (role) {
      msg.member?.roles.add(role);
    }

    msg.channel.send(
      "Successfully added your eth address, you can join war now!"
    );
  }
}

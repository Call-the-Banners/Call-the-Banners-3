import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { enlistChannelFilter } from "../utils";
import Web3 from "web3";
import { client } from "..";
import { userMention } from "@discordjs/builders";

export default class extends Command {
  name = "enlist";
  description =
    "!enlist add your eth address to join war. EX)!enlist <eth address>";

  async exec(message: Message, args: string[]) {
    enlistChannelFilter(message.channel.id);

    const userAddress = args[0];

    if (!userAddress) {
      throw new Error("Please key in your eth address!");
    }
    if (!Web3.utils.isAddress(userAddress)) {
      throw new Error("This is not an eth address!");
    }

    client.ethAddress.addEth(userAddress);
    client.ethAddress.save();

    const role = await message.guild?.roles.fetch(
      process.env.ENLISTED_ROLE_ID || ""
    );

    if (role) {
      message.member?.roles.add(role);
    }

    message.reply(
      `${userMention(
        message.author.id
      )} Successfully added your eth address, you can join war now!`
    );
  }
}

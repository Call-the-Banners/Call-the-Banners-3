import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Castle } from "../structure/Castle";


export default class extends Command {
  name = "hp";
  description = "show castle's HP";

  async exec(msg: Message, args: string[]) {

    const castleName = args[0];

    if (!castleName) {
      throw new Error("please specify which castle");
    }

    const castle = Castle.fromName(castleName);
    msg.channel.send(`${castle.name}'s HP: ${castle.hp}`);

  }
}

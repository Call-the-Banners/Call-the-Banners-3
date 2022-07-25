import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { Player } from "../structure/Player";
import { Ticket } from "../structure/Ticket";

export default class extends Command {
  name = "shop";
  description = "buy items with your coins";

  async exec(msg: Message, args: string[]) {

    const arg1 = args[0];
    const arg2 = args[1];
    const arg3 = args[2];
    const index = parseInt(arg2);

    if (!arg1) {

      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Shop")
        .setDescription("1. Ticket 100 coins")
        .addField("---", "To buy an item use command `!shop buy 1`");

      msg.channel.send({ embeds: [embed] });

      return;
    }

    if (isNaN(index)) {
      throw new Error("invalid index");
    } else if (arg1 !== "buy") {
      throw new Error("invalid action");
    }

    const player = Player.fromUser(msg.author);
    const amount = parseInt(arg3) || 1;

    if (amount < 1) {
      throw new Error("amount cannot be less than zero");
    }

    const cost = Ticket.price * amount;

    if (player.coins < cost) {
      throw new Error("insufficient balance");
    }

    player.coins -= cost;


    for (let i = 0; i < amount; i++) {
      const ticket = new Ticket();
      player.tickets.push(ticket);
      msg.channel.send(`Successfully purchased **raffle ticket #${ticket.id}**`);
    }

    player.save();

  }
}

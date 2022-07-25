import { Command } from "@jiman24/commandment";
import { bold, random } from "@jiman24/discordjs-utils";
import { Message, PermissionResolvable } from "discord.js";
import { client } from "..";
import { Player } from "../structure/Player";
import { Ticket } from "../structure/Ticket";


export default class extends Command {
  name = "raffle";
  description = "destroys all tickets and selects a winner";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {

    if (Ticket.all.length === 0) {
      throw new Error("no one owns a raffle ticket");
    }

    const winnerTicketID = random.pick(Ticket.all);

    msg.channel.send(`The winning ticket is **#${winnerTicketID}**`);

    const winnerData = client.players
      .find(player => (player.tickets || []).includes(winnerTicketID));

    const winner = Player.fromID(winnerData.id);

    if (winner) {

      msg.channel.send(`${bold(winner.name)} holds the winning ticket!`);

    }

    // deletes all raffle ticket
    client.players.forEach((player) => {
      client.players.set(player.id, [], "tickets");
    });

  }
}

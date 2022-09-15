import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { client } from "..";
import { Player } from "../structure/Player";
import { warChannelFilter } from "../utils";

export default class extends Command {
  name = "sharpen";
  description = "!sharpen sharpen your attack. EX)!sharpen";

  async exec(msg: Message) {
    warChannelFilter(msg.channel.id);
    const player = Player.fromUser(msg.author);
    const amount = 50;

    // Filter player with sharpen status
    const sharpenHistory = client.sharpenHistory.getPlayerSharpen(player.id);

    //Determine if player can receive sharpen status
    if (sharpenHistory.length > 0) {
      throw new Error("already sharpened before");
    }

    /**
     * Check player coin balance
     */
    if (player.coins < amount) {
      throw new Error("insufficient amount");
    }

    //Input data into sharpenHistory and deduct coins from player
    client.sharpenHistory.addSharpen({
      playerID: player.id,
      date: new Date(),
      used: false,
    });

    player.coins -= amount;

    client.sharpenHistory.save();
    player.save();

    msg.channel.send(`${player.name} received sharpen effect!`);
  }
}

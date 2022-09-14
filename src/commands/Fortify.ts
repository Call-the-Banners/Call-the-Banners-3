import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { client } from "..";
import { Castle } from "../structure/Castle";
import { Player } from "../structure/Player";
import { getCastleImage, warChannelFilter } from "../utils";

export default class extends Command {
  name = "fortify";
  description = "fortify castle";

  async exec(msg: Message, args: string[]) {
    warChannelFilter(msg.channel.id);
    if (client.battleStage.stage !== "ready") {
      throw new Error("you can only fortify on ready stage");
    }

    const castleName = args[0];
    const amountStr = args[1];
    const amount = parseInt(amountStr);

    if (!castleName) {
      throw new Error(`you need to mention a castle`);
    } else if (!amountStr) {
      throw new Error(`you need to give amount of coins to spend`);
    } else if (Number.isNaN(amount)) {
      throw new Error(`please give valid amount`);
    } else if (amount % 100 !== 0) {
      throw new Error(`please give amount in multiple of 100`);
    }

    const castle = Castle.fromName(castleName);
    const fortifyAmount = amount / Castle.FORTIFY_COST / 100;
    const castleNewHp = Math.round(castle.hp + castle.hp * fortifyAmount);

    if (castleNewHp > castle.maxhp) {
      throw new Error(
        `castle's HP will exceed if ${amount} coins is used to fortify this castle`
      );
    }

    const player = Player.fromUser(msg.author);

    if (player.coins < amount) {
      throw new Error("insufficient amount");
    } else if (player.role !== "general") {
      throw new Error("only general can fortify castle");
    }

    castle.hp = castleNewHp;
    castle.coinsSpent += amount;
    player.coins -= amount;

    castle.save();
    player.save();

    const attachment = await getCastleImage(
      castle.hp,
      castle.initialhp,
      castle.id
    );
    msg.channel.send({ files: [attachment] });

    msg.channel.send(
      `Successfully fortified ${castle.name} by +${fortifyAmount * 100}% HP`
    );
  }
}

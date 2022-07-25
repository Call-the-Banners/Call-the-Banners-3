import { Message } from "discord.js";
import { Command } from "@jiman24/commandment";
import { bold, cap, toNList } from "@jiman24/discordjs-utils";
import { client } from "..";
import { DateTime } from "luxon";

export default class extends Command {
  name = "battlestats";
  description = "show stats of a user for this current battle";

  async exec(msg: Message) {

    const member = msg.mentions.members?.first();

    if (!member) {
      throw new Error("you need to mention a user");
    }

    const strikes = client.strikeHistory.current.filter(x => x.playerID === member.id);
    const lines = strikes
      .map(x => {
        const dt = DateTime.fromJSDate(x.date);
        const relativeTime = dt.toRelative();
        
        return `Dealt ${bold(x.damage)} damage to ${bold(cap(x.castleID))} castle, ${relativeTime}`;
      });

    const strikeHistory = toNList(lines);

    msg.channel.send(strikeHistory || "nothing to show");
  }
}

import { Message } from "discord.js";
import { Command } from "@jiman24/commandment";
import { client } from "..";
import { stripIndents } from "common-tags";

export default class extends Command {
  name = "attackstats";
  description = "show attack stats of a user";

  async exec(msg: Message) {

    const member = msg.mentions.members?.first();

    if (!member) {
      throw new Error("you need to mention a user");
    }

    const strikeHistory = client.strikeHistory.allTime
      .filter(x => x.playerID === member.id);
    const currentStrikeHistory = client.strikeHistory.current
      .filter(x => x.playerID === member.id);

    const numberOfStrikesCurrentBattle = currentStrikeHistory.length;
    const numberOfStrikesAllTime = strikeHistory.length;
    const lifeTimeGrossAttack = strikeHistory.reduce((acc, x) => acc + x.damage, 0);
    let averageDamage = lifeTimeGrossAttack / numberOfStrikesAllTime;

    if (Number.isNaN(averageDamage)) {
      averageDamage = 0;
    }

    const text = stripIndents`Lifetime gross attack: ${lifeTimeGrossAttack}
    Average damage per attack: ${averageDamage}
    # of strikes current battle: ${numberOfStrikesCurrentBattle}
    # of strikes lifetime: ${numberOfStrikesCurrentBattle}
    `;

    msg.channel.send(text);
  }
}

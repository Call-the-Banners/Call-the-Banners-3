import { Message, MessageEmbed } from "discord.js";
import { Command } from "@jiman24/commandment";
import { client } from "..";

export default class extends Command {
  name = "stats";
  description = "full list of players ranked based on the total strikes dealt";

  private chunk<T>(arr: T[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  async exec(msg: Message, args: string[]) {
    
    const index = parseInt(args[0]) - 1 || 0;

    const players = [...client.players.values()]
      .map((player) => {
        const strikes = client
          .strikeHistory
          .current
          .filter(x => x.playerID === player.id);

        const strikeCount = strikes.length;
        const damageDealt = strikes.reduce((acc, val) => val.damage + acc, 0);

        return {
          name: player.name,
          strikeCount,
          damageDealt,
        }
      })
      .sort((a, b) => b.damageDealt - a.damageDealt)
      .map((x, i) => { 
        return `${i + 1}. ${x.name} ${x.damageDealt} ${x.strikeCount}` }
      );

    const chunkedPlayers = this.chunk(players, 10);
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Stats")
      .setFooter({ text: `Use command !${this.name} 2 to go to 2nd page\n[${index + 1}/${chunkedPlayers.length}]` });

    const list = chunkedPlayers.at(index);

    if (!list) {
      throw new Error(`You can give index between the range of 0..${chunkedPlayers.length}`);
    }

    embed.setDescription("Name | Damage Dealt | Strike Count" + "\n" + list.join("\n"));
    this.sendEmbed(msg, embed);
  }
}

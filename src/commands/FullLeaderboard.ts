import { Message, MessageEmbed, PermissionResolvable } from "discord.js";
import { Command } from "@jiman24/commandment";
import { client } from "..";

export default class extends Command {
  name = "fullleaderboard";
  description = "display all players and their coins (admin only)";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  private chunk<T>(arr: T[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  async exec(msg: Message, args: string[]) {

    const index = parseInt(args[0]) - 1 || 0;

    const players = [...client.players
      .values()]
      .sort((a, b) => b.coins - a.coins)
      .map((x, i) => `${i + 1}. ${x.name} ${x.coins}`);

    const chunkedPlayers = this.chunk(players, 10);
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Full Leaderboard")
      .setFooter({ text: `Use command !${this.name} 2 to go to 2nd page\n[${index + 1}/${chunkedPlayers.length}]` });

    const list = chunkedPlayers.at(index);

    if (!list) {
      throw new Error(`You can give index between the range of 0..${chunkedPlayers.length}`);
    }

    embed.setDescription("Name | Coins" + "\n" + list.join("\n"));
    this.sendEmbed(msg, embed);
  }
}

import { Message, MessageEmbed } from "discord.js";
import { Command } from "@jiman24/commandment";
import { client } from "..";
import paginationEmbed from "@psibean/discord.js-pagination";

export default class extends Command {
  name = "honor";
  description = "full list of players ranked based on the total strikes dealt";

  private chunk<T>(arr: T[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  async exec(msg: Message, args: string[]) {

    const medal = (num:number) => {
      switch (num) {
        case 1:
          return "🥇";
          break;
        case 2:
          return "🥈";
          break;
        case 3:
          return "🥉";
          break;
        default:
          return num;
          break;
      }
    }
    
    // const index = parseInt(args[0]) - 1 || 0;
    let pages: MessageEmbed[] = [];
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
        return {index: i + 1,name: x.name,damageDealt: x.damageDealt,strikeCount: x.strikeCount}
      }
      );
    const chunkedPlayers = this.chunk(players, 2);
    
    chunkedPlayers.map((x) => {
      let embed = new MessageEmbed()
      embed.setColor("RANDOM")
      embed.setTitle("Stats")
      embed.setThumbnail("https://media.istockphoto.com/vectors/pixel-art-seamless-background-vector-id910096016?k=20&m=910096016&s=612x612&w=0&h=uBDKuOLlgBItrIBWMZcHYPwWA5RZp610sMe6g0hxays=")
      for (const item of x) {
        embed.addField(`${medal(item.index)} `+`${item.name}`, "Damage Dealt: "+`${item.damageDealt}`+"\n Strike Count: "+`${item.strikeCount}`, false)
      }
      pages.push(embed)
    })
    paginationEmbed(msg, pages);
  }
}

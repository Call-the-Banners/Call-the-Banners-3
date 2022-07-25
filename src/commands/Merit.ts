import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { client } from "..";
import paginationEmbed from "@psibean/discord.js-pagination";

export default class extends Command {
  name = "merit";
  description = "show player leaderboard";

  private chunk<T>(arr: T[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }

  async exec(msg: Message) {

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

    let pages: MessageEmbed[] = [];

    const players = client.players.array()
       .sort((a, b) => b.coins - a.coins)
       .map((x, i) => {
         return {index: i+1, name: x.name, coins: x.coins}
       });

    const chunkedPlayers = this.chunk(players, 2);
    
    chunkedPlayers.map((x) => {
      let embed = new MessageEmbed()
      embed.setColor("RANDOM")
      embed.setTitle("Leaderboard")
      embed.setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVM3S21YjZuISQInR4jDkyVDRAUOG_YkL-jj6N7CPYNj1-7-sXplmM-G-OuN2EWITs-Bk&usqp=CAU")
      for (const item of x){
        embed.addField(`${medal(item.index++)} `+`${item.name}`, "Coin: "+`${item.coins}`, false)
      }
      pages.push(embed)
    })
    paginationEmbed(msg, pages);
  }
}

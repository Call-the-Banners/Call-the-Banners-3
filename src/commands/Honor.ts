import { Message, MessageEmbed } from "discord.js";
import { Command } from "@jiman24/commandment";
import { client } from "..";
import paginationEmbed from "@psibean/discord.js-pagination";
import { chunk, getMedal, botCommandChannelFilter } from "../utils";

const getHonorMessageEmbedTemplate = () =>
  new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Honor")
    .setThumbnail(
      "https://media.discordapp.net/attachments/982462379449282613/1019598443825606656/Honor-Header.jpg"
    );

export default class extends Command {
  name = "honor";
  description =
    "!honor full list of players ranked based on the total strikes dealt. EX)!honor";

  async exec(msg: Message, _args: string[]) {
    botCommandChannelFilter(msg.channel.id);
    // Consolidate player attribute and sort player by damage
    const players = [...client.players.values()]
      .map((player) => {
        const strikes = client.strikeHistory.current.filter(
          (x) => x.playerID === player.id
        );

        const strikeCount = strikes.length;
        const damageDealt = strikes.reduce((acc, val) => val.damage + acc, 0);

        return {
          name: player.name,
          strikeCount,
          damageDealt,
        };
      })
      .sort((a, b) => b.damageDealt - a.damageDealt);

    // Seperate player by pages
    const playerPerPage = 5;
    const chunkedPlayers = chunk(players, playerPerPage);

    // Transform chunkedPlayers into array of pages data
    const pagesData = chunkedPlayers.map((chunk, chunkIndex) =>
      getHonorMessageEmbedTemplate().setFields(
        chunk.map((player, playerIndex) => ({
          name: `${getMedal(chunkIndex * playerPerPage + (playerIndex + 1))} ${
            player.name
          }`,
          value: `Damage Dealt: ${player.damageDealt}\n Strike Count: ${player.strikeCount}`,
          inline: true,
        }))
      )
    );

    if (pagesData.length <= 0) {
      return msg.reply({
        embeds: [
          getHonorMessageEmbedTemplate().setDescription(
            "Honor board is currently empty."
          ),
        ],
      });
    }

    return paginationEmbed(msg, pagesData);
  }
}

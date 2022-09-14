import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { client } from "..";
import paginationEmbed from "@psibean/discord.js-pagination";
import { chunk, getMedal, warChannelFilter } from "../utils";
import { Player } from "../structure/Player";

const getMeritMessageEmbedTemplate = () =>
  new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Merit")
    .setThumbnail(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVM3S21YjZuISQInR4jDkyVDRAUOG_YkL-jj6N7CPYNj1-7-sXplmM-G-OuN2EWITs-Bk&usqp=CAU"
    );

export default class extends Command {
  name = "merit";
  description = "show player leaderboard";

  async exec(msg: Message) {
    warChannelFilter(msg.channel.id);
    // Sort player by coin
    const players: Player[] = client.players
      .array()
      .sort((a, b) => b.coins - a.coins);

    // Chunk player into different chunk
    const playerPerPage = 5;
    const chunkedPlayers = chunk(players, playerPerPage);

    // Transform chunkedPlayers into array of pages data
    const pagesData = chunkedPlayers.map((chunk, chunkIndex) => {
      let embed = getMeritMessageEmbedTemplate().setFields(
        chunk.map((player, playerIndex) => ({
          name: `${getMedal(chunkIndex * playerPerPage + (playerIndex + 1))} ${
            player.name
          }`,
          value: `Coin: ${player.coins}`,
          inline: true,
        }))
      );
      return embed;
    });

    if (pagesData.length <= 0) {
      return msg.reply({
        embeds: [
          getMeritMessageEmbedTemplate().setDescription(
            "Merit board is currently empty."
          ),
        ],
      });
    }

    paginationEmbed(msg, pagesData);
  }
}

import { Command } from "@jiman24/commandment";
import { Message, MessageEmbed } from "discord.js";
import { client } from "..";
import paginationEmbed from "@psibean/discord.js-pagination";
import { chunk, getMedal, botCommandChannelFilter } from "../utils";
import { Player } from "../structure/Player";

const getMeritMessageEmbedTemplate = () =>
  new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Merit")
    .setThumbnail(
      "https://media.discordapp.net/attachments/982462379449282613/1019598444052095016/Merit-Header.jpg"
    );

export default class extends Command {
  name = "merit";
  description = "!merit show player leaderboard. EX)!merit";

  async exec(msg: Message) {
    botCommandChannelFilter(msg.channel.id);
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

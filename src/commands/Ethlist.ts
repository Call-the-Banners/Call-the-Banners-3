import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable, MessageEmbed } from "discord.js";
import paginationEmbed from "@psibean/discord.js-pagination";
import { client } from "..";
import { chunk } from "../utils";

const getEmbedTemplate = () =>
  new MessageEmbed().setColor("RANDOM").setTitle("Eth Address List");

export default class extends Command {
  name = "ethlist";
  description = "show eth address list";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {
    const addressPerPage = 10;
    const ethList = client.ethAddress.allTime;
    const chunkedAddress = chunk(ethList, addressPerPage);
    let index = 1;

    const pagesData = chunkedAddress.map((chunk) => {
      let embed = getEmbedTemplate();
      chunk.map((address) => {
        embed.addField(`${index++}`, `${address}`, false);
      });
      return embed;
    });

    if (pagesData.length <= 0) {
      return msg.reply({
        embeds: [
          getEmbedTemplate().setDescription(
            "Eth Address list is currently empty."
          ),
        ],
      });
    }

    paginationEmbed(msg, pagesData);
  }
}

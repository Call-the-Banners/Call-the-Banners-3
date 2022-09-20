import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable, MessageEmbed } from "discord.js";
import paginationEmbed from "@psibean/discord.js-pagination";
import { client } from "..";
import { chunk } from "../utils";
import { codeBlock } from "@discordjs/builders";

const getEmbedTemplate = () =>
  new MessageEmbed().setColor("RANDOM").setTitle("Eth Address List");

export default class extends Command {
  name = "enlisted";
  disabled = true;
  description = "!enlisted show eth address list (admin only). EX)!enlisted";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {
    const addressPerPage = 10;
    const ethList = client.ethAddress.allTime;
    const chunkedAddress = chunk(ethList, addressPerPage);

    const pagesData = chunkedAddress.map((chunk) =>
      getEmbedTemplate().setDescription(
        codeBlock(
          chunk.reduce(
            (acc, curr, currIndex) =>
              `${acc}${currIndex !== 0 ? "\n" : ""}${curr}`,
            ""
          )
        )
      )
    );

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

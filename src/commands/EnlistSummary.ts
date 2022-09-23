import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { client } from "..";

export default class extends Command {
  name = "enlistSummary";
  description =
    "!generate a file that summarized all the enlisted eth address. EX)!enlistsummary";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {
    const fs = require("fs");
    const ethList = client.ethAddress.allTime;
    const dirname = "enlistsummary";
    const filename = "summary";

    const data = ethList.map((data) => {
      return (
        "name:" + data.name + " id:" + data.id + " address:" + data.address
      );
    });

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }

    fs.writeFileSync(
      dirname + "/" + filename + ".txt",
      data.reduce((prev, curr) => prev + "\n" + curr)
    );

    msg.channel.send("Successfully update summary file!");
  }
}

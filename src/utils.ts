import { MessageAttachment } from "discord.js";
import Canvas from "@napi-rs/canvas";
import { random } from "@jiman24/discordjs-utils";

export function chunk<T>(arr: T[], size: number) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

export function decimalCheck<T>(num: number, decimal: number) {
  return num.toFixed(decimal).replace(/[.,]00$/, "");
}

export function getMedal(num: number) {
  switch (num) {
    case 1:
      return ":first_place:";
    case 2:
      return ":second_place:";
    case 3:
      return ":third_place:";
  }

  return num;
}

export async function getCastleImage(
  currenthp: number,
  initialhp: number,
  castleName: string
) {
  const hpBarWidth = 350;

  const hpPercentage = currenthp / initialhp;

  const canvas = Canvas.createCanvas(400, 280);
  const context = canvas.getContext("2d");
  let background = await Canvas.loadImage(
    getBaseCastleImage(hpPercentage, castleName)
  );

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.fillStyle = "#4C4E52";
  context.rect(25, 25, hpBarWidth, 5);
  context.stroke();
  context.fill();

  let setHpBarWidth = (hpPercentage % 1) * hpBarWidth;
  if (hpPercentage >= 1) {
    setHpBarWidth = hpBarWidth;
  }

  context.beginPath();
  context.fillStyle = "#FF0000";
  context.rect(25, 25, setHpBarWidth, 5);
  context.stroke();
  context.fill();

  if (hpPercentage > 1) {
    context.beginPath();
    context.fillStyle = "#B800B2";
    context.rect(25, 25, (hpPercentage - 1) * hpBarWidth, 5);
    context.stroke();
    context.fill();
  }

  const attachment = new MessageAttachment(
    await canvas.encode("png"),
    "castle.png"
  );

  return attachment;
}

export function getBaseCastleImage(percentage: number, castleName: string) {
  switch (castleName) {
    case "south":
      if (percentage > 0.65) {
        return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997364968722463/CastleState1Blue.png";
      }
      if (percentage > 0.35) {
        return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997367896346664/CastleState2Blue.png";
      }
      if (percentage > 0) {
        return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997369062371388/CastleState3Blue.png";
      }

      return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997370832375808/CastleState4Blue.png";

    case "north":
      if (percentage > 0.65) {
        return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997365295894598/CastleState1Red.png";
      }
      if (percentage > 0.35) {
        return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997368437424148/CastleState2Red.png";
      }
      if (percentage > 0) {
        return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997369439862784/CastleState3Red.png";
      }

      return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997371167916053/CastleState4Red.png";
  }

  return "https://cdn.discordapp.com/attachments/1008996898155286590/1008997364968722463/CastleState1Blue.png";
}

export function getMultiplier() {
  const randomize = random.integer(1, 10);
  return randomize * 0.25;
}

export function warChannelFilter(channelId: string) {
  if (channelId != "996302755792703522") {
    throw new Error("This command only allow in war channel");
  }
}

export function enlistChannelFilter(channelId: string) {
  if (channelId != "1018755416609525823") {
    throw new Error("This command only allow in enlist channel");
  }
}

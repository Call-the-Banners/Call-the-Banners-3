import { MessageAttachment } from "discord.js";
import Canvas from "@napi-rs/canvas";

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

export async function castleStatus(
  currenthp: number,
  initialhp: number,
  castleName: string
) {
  const percentage = (currenthp / initialhp) * 100;
  let percentageOnProgress = (currenthp / initialhp) * 350;
  let barrier;

  if (percentageOnProgress > 350) {
    barrier = percentageOnProgress - 350;
    percentageOnProgress = 350;
  }

  const canvas = Canvas.createCanvas(400, 280);
  const context = canvas.getContext("2d");
  let background = await Canvas.loadImage(
    getCastleImage(percentage, castleName)
  );

  // This uses the canvas dimensions to stretch the image onto the entire canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.fillStyle = "#4C4E52";
  context.rect(25, 25, 350, 5);
  context.stroke();
  context.fill();

  context.beginPath();
  context.fillStyle = "#FF0000";
  context.rect(25, 25, percentageOnProgress, 5);
  context.stroke();
  context.fill();

  if (barrier) {
    context.beginPath();
    context.fillStyle = "#B800B2";
    context.rect(25, 25, barrier, 5);
    context.stroke();
    context.fill();
  }

  const attachment = new MessageAttachment(
    await canvas.encode("png"),
    "test.png"
  );

  return attachment;
}

export function getCastleImage(percentage: number, castleName: string) {
  //PlaceHolder
  let imageUrl =
    "https://cdn.discordapp.com/attachments/1008996898155286590/1008997364968722463/CastleState1Blue.png";

  switch (castleName) {
    case "south":
      if (percentage > 65) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997364968722463/CastleState1Blue.png";
      }
      if (percentage > 35 && percentage <= 65) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997367896346664/CastleState2Blue.png";
      }
      if (percentage > 0 && percentage <= 35) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997369062371388/CastleState3Blue.png";
      }
      if (percentage <= 0) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997370832375808/CastleState4Blue.png";
      }
      break;
    case "north":
      if (percentage > 65) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997365295894598/CastleState1Red.png";
      }
      if (percentage > 35 && percentage <= 65) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997368437424148/CastleState2Red.png";
      }
      if (percentage > 0 && percentage <= 35) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997369439862784/CastleState3Red.png";
      }
      if (percentage <= 0) {
        imageUrl =
          "https://cdn.discordapp.com/attachments/1008996898155286590/1008997371167916053/CastleState4Red.png";
      }
      break;
  }
  return imageUrl;
}

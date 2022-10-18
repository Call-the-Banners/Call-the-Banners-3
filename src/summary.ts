import { client } from ".";
import { Player } from "./structure/Player";

const fs = require("fs");
const ethList = client.ethAddress.allTime;
const dirname = "enlistsummary";
const filename = "summary";
const title = "name,id,address,strikes,totalDmg,avgDmg,coins\n";

const data = ethList.map((ethEntry) => {
  const player = Player.fromID(ethEntry.id)

  const strikeHistory = client.strikeHistory.allTime.filter(
    (x) => x.playerID === ethEntry.id
  );
  const strikes = client.strikeHistory.current.filter((x) => x.playerID === ethEntry.id)

  const numberOfStrikesAllTime = strikeHistory.length;
  const lifeTimeGrossAttack = strikeHistory.reduce(
    (acc, x) => acc + x.damage,
    0
  );
  const averageDamage = lifeTimeGrossAttack / numberOfStrikesAllTime || 0;
  const totalDamage = strikes.reduce(
    (acc, x) => acc + x.damage,
    0
  );

  return `${ethEntry.name},${ethEntry.id},${ethEntry.address},${strikeHistory.length},${totalDamage},${averageDamage},${player?.coins || 0}`;
});

if (!fs.existsSync(dirname)) {
  fs.mkdirSync(dirname);
}

fs.writeFileSync(
  `${dirname}/${filename}.csv`,
  title + data.reduce((acc, curr) => `${acc}\n${curr}`)
);

process.exit(0);

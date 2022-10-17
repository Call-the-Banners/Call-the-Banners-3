import { client } from ".";

const fs = require("fs");
const ethList = client.ethAddress.allTime;
const dirname = "enlistsummary";
const filename = "summary";
const title = "name,id,address,strikes\n";

const data = ethList.map((ethEntry) => {
  const strikeHistory = client.strikeHistory.allTime.filter(
    (x) => x.playerID === ethEntry.id
  );

  return `${ethEntry.name},${ethEntry.id},${ethEntry.address},${strikeHistory.length}`;
});

if (!fs.existsSync(dirname)) {
  fs.mkdirSync(dirname);
}

fs.writeFileSync(
  `${dirname}/${filename}.csv`,
  title + data.reduce((acc, curr) => `${acc}\n${curr}`)
);

process.exit(0);

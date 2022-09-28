import { client } from ".";

const fs = require("fs");
const ethList = client.ethAddress.allTime;
const dirname = "enlistsummary";
const filename = "summary";
const title = "name,id,address\n";

const data = ethList.map((data) => {
  return data.name + "," + data.id + "," + data.address;
});

if (!fs.existsSync(dirname)) {
  fs.mkdirSync(dirname);
}

fs.writeFileSync(
  dirname + "/" + filename + ".txt",
  title + data.reduce((prev, curr) => prev + "\n" + curr)
);

process.exit(0);

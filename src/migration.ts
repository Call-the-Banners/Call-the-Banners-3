import { client } from ".";
import { Castle } from "./structure/Castle";
import { Player } from "./structure/Player";

function resetCastle(castle: Castle) {
  const newCastle = new Castle(castle.id, castle.name);
  newCastle.save();
}

resetCastle(Castle.castleA);
resetCastle(Castle.castleB);

client.players.forEach((_, id) => {
  const player = Player.fromID(id as string);

  if (!player) return;

  player.role = "sword";
  player.save();

})

console.log("reset succesfully");

process.exit(0);

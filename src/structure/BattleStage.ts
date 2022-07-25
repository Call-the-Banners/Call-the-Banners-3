import { TextBasedChannel } from "discord.js";
import Enmap from "enmap";
import { client } from "..";
import { Castle } from "./Castle";
import { Player } from "./Player";
import { Sword } from "./Sword";

/** 
 * There are 3 stages in this game:
 * ready - generals can fortify and players cannot attack and castle's hp reset
 * start - generals cannot fortify and players can attack
 * end - general cannot fortify and players cannot attack
 * */
export type Stage = "ready" | "start" | "end";

export class BattleStage {
  id = "main";
  stage: Stage = "ready";
  private static db = new Enmap("battle_stage");

  constructor() {
    const data = BattleStage.db.get(this.id);
    Object.assign(this, data);
  }

  setReadyStage(channel: TextBasedChannel) {

    this.stage = "ready";
    this.save();

    channel.send(`Generals now may fortify their castle`);
    channel.send(`All castles cannot be attacked at this stage`);

    // reset castle hp
    Castle.castleA.hp = Castle.INITIAL_HP;
    Castle.castleA.save();

    Castle.castleB.hp = Castle.INITIAL_HP;
    Castle.castleB.save();
  }

  setStartStage(channel: TextBasedChannel) {
    this.stage = "start";
    this.save();

    const castleAGeneral = Castle.castleA.general;
    const castleBGeneral = Castle.castleB.general;

    if (!castleAGeneral) {
      throw new Error("North Castle has not been assigned a general");
    } else if (!castleBGeneral) {
      throw new Error("South Castle has not been assigned a general");
    }

    channel.send(`Generals can no longer fortify castle`);
    channel.send(`Swords and Generals now may attack castle`);
  }

  setEndStage(channel: TextBasedChannel) {
    this.stage = "end";
    this.save();
    
    channel.send(`All castles cannot be attacked at this stage`);

    const castleA = Castle.castleA;
    const castleB = Castle.castleB;

    if (castleA.hp === castleB.hp) {
      throw new Error("Both castle has the same hp. No winner");
    }

    const winnerCastle = castleA.hp > castleB.hp ? castleA : castleB;
    const loserCastle = castleA.hp < castleB.hp ? castleA : castleB;


    const winGeneral = winnerCastle.general;
    const loseGeneral = loserCastle.general;

    if (!winGeneral) {
      throw new Error(`${winGeneral} has not been assigned a general`);
    } else if (!loseGeneral) {
      throw new Error(`${loseGeneral} has not been assigned a general`);
    }

    channel.send(`${winnerCastle.name} Castle wins!`);

    winGeneral.coins += Castle.GENERAL_REWARD;
    winGeneral.save();
    channel.send(`${winGeneral.name} received ${Castle.GENERAL_REWARD} coins`);

    winnerCastle.removeGeneral();
    winnerCastle.hp = Castle.INITIAL_HP;
    winnerCastle.coinsSpent = 0;
    winnerCastle.save();

    const coinsTaken = loseGeneral.coins;
    loseGeneral.coins = 0;
    loseGeneral.save();
    channel.send(`${coinsTaken} coins are taken away from ${loseGeneral.name}`);

    loserCastle.removeGeneral();
    loserCastle.hp = Castle.INITIAL_HP;
    loserCastle.coinsSpent = 0;
    loserCastle.save();

    client.players.forEach((_, id) => {

      const player = Player.fromID(id as string)!;

      if (player instanceof Sword) {

        const strikeHistory = client.strikeHistory.current
          .filter(x => x.playerID === player.id);

        player.rankUp(strikeHistory.length);
      }

      player.lastAttack = new Date(2000);
      player.save();
    });

    client.strikeHistory.clear();
    client.strikeHistory.save();
  }

  setStage(channel: TextBasedChannel, stage: Stage | string) {

    if (stage === this.stage) {
      throw new Error(`already in the ${this.stage} stage`);
    }

    switch (stage) {
      case "start": this.setStartStage(channel); break;
      case "ready": this.setReadyStage(channel); break;
      case "end": this.setEndStage(channel); break;
      default: throw new Error(`invalid stage "${stage}"`);
    }
  }

  save() {
    BattleStage.db.set(this.id, { ...this });
  }
}

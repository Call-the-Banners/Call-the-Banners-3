import { client } from "..";
import { Player } from "./Player";

const MIN_ATTACK_CAP = 80;

export class Sword extends Player {
  COOLDOWN: number;
  constructor(id: string, name: string, role: "sword" | "general") {
    super(id, name, role);
    this.COOLDOWN = client.settings.swordsCooldown;
  }

  rankUp(currentBattleStrikes: number) {

    if (this.minAttack < MIN_ATTACK_CAP) {

      if (currentBattleStrikes > 10) {
        this.minAttack += 2;
      } else {
        this.minAttack += 1;
      }

    }

  }
}

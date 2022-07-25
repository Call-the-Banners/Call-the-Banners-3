import { client } from "..";
import { Player } from "./Player";

export class General extends Player {
  static readonly MAX = 2;
  COOLDOWN: number;
  coins: number = 10_000;
  constructor(id: string, name: string, role: "general" | "sword" ) {
    super(id, name, role);
    this.COOLDOWN = client.settings.generalCooldown;
  }
}

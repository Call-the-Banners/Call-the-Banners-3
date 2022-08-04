import { random } from "@jiman24/discordjs-utils";
import { User } from "discord.js";
import { DateTime } from "luxon";
import { client } from "..";
import type { Sword } from "./Sword";
import { Ticket } from "./Ticket";


export abstract class Player {
  coins = 0;
  minAttack = 50;
  maxAttack = 100;
  lastAttack = new Date(2000);
  strikeCount = 0;
  tickets: Ticket[] = [];
  abstract COOLDOWN: number;

  constructor(
    public readonly id: string,
    public name: string,
    public role: "general" | "sword",
  ) {}

  // Instantiate Sword or General class based on player role. Creates new Sword
  // if player not exists
  static fromUser(user: User): Sword {
    const { Sword } = require("./Sword");
    return Player.fromID(user.id) || new Sword(user.id, user.username, "sword");
  }

  static fromID(id: string) {
    const { General } = require("./General");
    const { Sword } = require("./Sword");

    const data = client.players.get(id);

    if (!data) return;

    let player: Player = new Sword(id, "", "sword");

    if (data.role === "general") {
      player = new General(data.id, data.name, data.role);
    }

    Object.assign(player, data);

    //@ts-ignore
    player.tickets = player.tickets.map((id: string) => Ticket.fromID(id));

    return player;
  }

  isOnCooldown() {
    const lastAttack = DateTime.fromJSDate(this.lastAttack);
    const diff = Math.abs(lastAttack.diffNow(["hours"]).hours);

    return diff < this.COOLDOWN;
  }

  timeLeft() {
    const lastAttack = DateTime.fromJSDate(this.lastAttack).plus({ hours: this.COOLDOWN });
    const { hours, minutes, seconds } = lastAttack.diffNow(["hours", "minutes", "seconds"]);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  attack() {
    const sharpen = client.sharpenHistory.allTime
      .filter((sharpenObj) => sharpenObj.playerID === this.id && sharpenObj.used === false)
    let _maxAttack = this.maxAttack;
    if (Object.keys(sharpen).length != 0) {
      _maxAttack = 200;
      client.sharpenHistory.useSharpen(this.id);
      client.sharpenHistory.save();
    }
    return random.integer(this.minAttack, _maxAttack);
  }

  save() {
    const { COOLDOWN, ...data } = this;
    client.players.set(this.id, { ...data, tickets: data.tickets.map(x => x.id) });
  }
}

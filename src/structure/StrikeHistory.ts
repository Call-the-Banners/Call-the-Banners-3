import Enmap from "enmap";

interface Strike {
  playerID: string;
  castleID: string;
  date: Date;
  damage: number;
}

export class StrikeHistory {
  id = "main";
  private static db = new Enmap("strike_history");
  allTime: Strike[] = [];
  current: Strike[] = [];

  constructor() {
    const data = StrikeHistory.db.get(this.id);
    Object.assign(this, data);
  }

  addStrike(strike: Strike) {
    this.allTime.push(strike);
    this.current.push(strike);
  }

  // Clears current battle strikes. Should be called on "end" stage
  clear() {
    this.current = [];
  }

  save() {
    StrikeHistory.db.set(this.id, { ...this });
  }
}

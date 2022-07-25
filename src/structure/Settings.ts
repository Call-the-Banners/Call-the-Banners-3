import Enmap from "enmap";


export class Settings {
  id = "main";
  generalCooldown = 3; // hours
  swordsCooldown = 7; // hours
  private static db = new Enmap("settings");

  constructor() {
    const data = Settings.db.get(this.id);
    Object.assign(this, data);
  }

  save() {
    Settings.db.set(this.id, { ...this });
  }
}


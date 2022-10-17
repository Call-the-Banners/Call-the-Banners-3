import { CommandManager } from "@jiman24/commandment";
import { Client as DiscordClient } from "discord.js";
import type { ClientOptions } from "discord.js";
import Enmap from "enmap";
import { BattleStage } from "./BattleStage";
import { Settings } from "./Settings";
import { StrikeHistory } from "./StrikeHistory";
import { SharpenHistory } from "./SharpenHistory";
import { LoadHistory } from "./LoadHistory";
import { EthAddress } from "./EthAddress";

export class Client extends DiscordClient {
  commandManager = new CommandManager(process.env.PREFIX || "!");
  players = new Enmap("player");
  castles = new Enmap("castle");
  battleStage: BattleStage;
  settings: Settings;
  strikeHistory: StrikeHistory;
  sharpenHistory: SharpenHistory;
  loadHistory: LoadHistory;
  ethAddress: EthAddress;

  constructor(options: ClientOptions) {
    super(options);
    this.battleStage = new BattleStage();
    this.settings = new Settings();
    this.strikeHistory = new StrikeHistory();
    this.sharpenHistory = new SharpenHistory();
    this.loadHistory = new LoadHistory();
    this.ethAddress = new EthAddress();
  }
}

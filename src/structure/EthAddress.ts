import Enmap from "enmap";

export class EthAddress {
  id = "main";
  private static db = new Enmap("eth_address");
  allTime: string[] = [];

  constructor() {
    const data = EthAddress.db.get(this.id);
    Object.assign(this, data);
  }

  addEth(eth: string) {
    this.allTime.push(eth);
  }

  save() {
    EthAddress.db.set(this.id, { ...this });
  }
}

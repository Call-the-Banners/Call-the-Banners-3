import Enmap from "enmap";

export interface EthAddressData {
  name: string;
  id: string;
  address: string;
}
export class EthAddress {
  id = "main";
  private static db = new Enmap("eth_address");
  allTime: EthAddressData[] = [];

  constructor() {
    const data = EthAddress.db.get(this.id);
    Object.assign(this, data);
  }

  addEth(eth: EthAddressData) {
    this.allTime.push(eth);
  }

  clear() {
    this.allTime = [];
  }

  save() {
    EthAddress.db.set(this.id, { ...this });
  }
}

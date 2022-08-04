import Enmap from "enmap";

interface Sharpen {
    playerID: string;
    date: Date;
    used: boolean;
}

export class SharpenHistory {
    id = "main";
    private static db = new Enmap("sharpen_history");
    allTime: Sharpen[] = [];

    constructor() {
        const data = SharpenHistory.db.get(this.id);
        Object.assign(this, data);
    }

    addSharpen(sharpen: Sharpen) {
        this.allTime.push(sharpen);
    }

    save() {
        SharpenHistory.db.set(this.id, { ...this });
    }

    useSharpen(playerID: string) {
        const sharpendata = this.allTime.map((sharpenObj) =>
            (sharpenObj.playerID === playerID && sharpenObj.used === false) ?
                {
                    ...sharpenObj,
                    used: true
                } :
                sharpenObj
        )
        this.allTime = sharpendata;
    }

    delete() {
        SharpenHistory.db.deleteAll();
    }
}
import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { client } from "..";
import { Player } from "../structure/Player";

export default class extends Command {
    name = "sharpen";
    description = "sharpen your attack";
    
    async exec(msg: Message) {
        const player = Player.fromUser(msg.author);
        const amount = 50;

        // Filter player with sharpen status
        const sharpenHistory  = client.sharpenHistory.allTime
            .filter((sharpenObj) => sharpenObj.playerID === player.id && sharpenObj.used === false)

        //Determine if player can receive sharpen status
        if(Object.keys(sharpenHistory).length != 0){
            throw new Error("already sharpened before")            
        }else if (player.coins < amount) {
            throw new Error("insufficient amount");
        }

        //Input data into sharpenHistory and deduct coins from player 
        client.sharpenHistory.addSharpen({
            playerID: player.id,
            date: new Date,
            used: false
        })

        player.coins -= amount;

        client.sharpenHistory.save();
        player.save();

        msg.channel.send(`${player.name} received sharpen effect!`);
    }
}
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.BattleStage = void 0;
var enmap_1 = require("enmap");
var __1 = require("..");
var Castle_1 = require("./Castle");
var Player_1 = require("./Player");
var Sword_1 = require("./Sword");
var BattleStage = /** @class */ (function () {
    function BattleStage() {
        this.id = "main";
        this.stage = "ready";
        var data = BattleStage.db.get(this.id);
        Object.assign(this, data);
    }
    BattleStage.prototype.setReadyStage = function (channel) {
        this.stage = "ready";
        this.save();
        channel.send("Generals now may fortify their castle");
        channel.send("All castles cannot be attacked at this stage");
        // reset castle hp
        Castle_1.Castle.castleA.hp = Castle_1.Castle.INITIAL_HP;
        Castle_1.Castle.castleA.save();
        Castle_1.Castle.castleB.hp = Castle_1.Castle.INITIAL_HP;
        Castle_1.Castle.castleB.save();
    };
    BattleStage.prototype.setStartStage = function (channel) {
        this.stage = "start";
        this.save();
        var castleAGeneral = Castle_1.Castle.castleA.general;
        var castleBGeneral = Castle_1.Castle.castleB.general;
        if (!castleAGeneral) {
            throw new Error("North Castle has not been assigned a general");
        }
        else if (!castleBGeneral) {
            throw new Error("South Castle has not been assigned a general");
        }
        channel.send("Generals can no longer fortify castle");
        channel.send("Swords and Generals now may attack castle");
    };
    BattleStage.prototype.setEndStage = function (channel) {
        this.stage = "end";
        this.save();
        channel.send("All castles cannot be attacked at this stage");
        var castleA = Castle_1.Castle.castleA;
        var castleB = Castle_1.Castle.castleB;
        if (castleA.hp === castleB.hp) {
            throw new Error("Both castle has the same hp. No winner");
        }
        var winnerCastle = castleA.hp > castleB.hp ? castleA : castleB;
        var loserCastle = castleA.hp < castleB.hp ? castleA : castleB;
        var winGeneral = winnerCastle.general;
        var loseGeneral = loserCastle.general;
        if (!winGeneral) {
            throw new Error("".concat(winGeneral, " has not been assigned a general"));
        }
        else if (!loseGeneral) {
            throw new Error("".concat(loseGeneral, " has not been assigned a general"));
        }
        channel.send("".concat(winnerCastle.name, " Castle wins!"));
        winGeneral.coins += Castle_1.Castle.GENERAL_REWARD;
        winGeneral.save();
        channel.send("".concat(winGeneral.name, " received ").concat(Castle_1.Castle.GENERAL_REWARD, " coins"));
        winnerCastle.removeGeneral();
        winnerCastle.hp = Castle_1.Castle.INITIAL_HP;
        winnerCastle.coinsSpent = 0;
        winnerCastle.save();
        var coinsTaken = loseGeneral.coins;
        loseGeneral.coins = 0;
        loseGeneral.save();
        channel.send("".concat(coinsTaken, " coins are taken away from ").concat(loseGeneral.name));
        loserCastle.removeGeneral();
        loserCastle.hp = Castle_1.Castle.INITIAL_HP;
        loserCastle.coinsSpent = 0;
        loserCastle.save();
        __1.client.players.forEach(function (_, id) {
            var player = Player_1.Player.fromID(id);
            if (player instanceof Sword_1.Sword) {
                var strikeHistory = __1.client.strikeHistory.current
                    .filter(function (x) { return x.playerID === player.id; });
                player.rankUp(strikeHistory.length);
            }
            player.lastAttack = new Date(2000);
            player.save();
        });
        __1.client.strikeHistory.clear();
        __1.client.strikeHistory.save();
    };
    BattleStage.prototype.setStage = function (channel, stage) {
        if (stage === this.stage) {
            throw new Error("already in the ".concat(this.stage, " stage"));
        }
        switch (stage) {
            case "start":
                this.setStartStage(channel);
                break;
            case "ready":
                this.setReadyStage(channel);
                break;
            case "end":
                this.setEndStage(channel);
                break;
            default: throw new Error("invalid stage \"".concat(stage, "\""));
        }
    };
    BattleStage.prototype.save = function () {
        BattleStage.db.set(this.id, __assign({}, this));
    };
    BattleStage.db = new enmap_1["default"]("battle_stage");
    return BattleStage;
}());
exports.BattleStage = BattleStage;

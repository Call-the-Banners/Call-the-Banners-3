"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.Castle = void 0;
var __1 = require("..");
var Player_1 = require("./Player");
function createCastle(id, name) {
    var castle = new Castle(id, name);
    var data = __1.client.castles.get(castle.id);
    if (!data) {
        castle.save();
    }
    else {
        Object.assign(castle, data);
    }
    if (castle.generalID) {
        castle.general = Player_1.Player.fromID(castle.generalID);
    }
    return castle;
}
var Castle = /** @class */ (function () {
    function Castle(id, name) {
        this.id = id;
        this.name = name;
        this.hp = Castle.INITIAL_HP;
        this.coinsSpent = 0;
    }
    Castle.prototype.removeGeneral = function () {
        if (!this.general)
            return;
        this.general.role = "sword";
        this.general.save();
        delete this.generalID;
        this.save();
    };
    Object.defineProperty(Castle, "castleA", {
        get: function () {
            return createCastle("north", "North");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Castle, "castleB", {
        get: function () {
            return createCastle("south", "South");
        },
        enumerable: false,
        configurable: true
    });
    Castle.fromName = function (name) {
        switch (name.toLowerCase()) {
            case Castle.castleA.name.toLowerCase(): return Castle.castleA;
            case Castle.castleB.name.toLowerCase(): return Castle.castleB;
            default: throw new Error("cannot find castle");
        }
    };
    Castle.prototype.save = function () {
        var _a = this, general = _a.general, data = __rest(_a, ["general"]);
        __1.client.castles.set(this.id, data);
    };
    Castle.prototype["delete"] = function () {
        __1.client.castles["delete"](this.id);
    };
    Castle.INITIAL_HP = 10000;
    Castle.MAX_HP = 15000;
    Castle.MAX = 2;
    Castle.FORTIFY_COST = 100;
    Castle.BATTLE_COST = 5000;
    Castle.FATAL_BLOW_REWARD = Math.round((Castle.BATTLE_COST * 2) * 0.1);
    Castle.GENERAL_REWARD = 5000;
    return Castle;
}());
exports.Castle = Castle;

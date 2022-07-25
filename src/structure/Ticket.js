"use strict";
exports.__esModule = true;
exports.Ticket = void 0;
var Player_1 = require("./Player");
var uuidv4_1 = require("uuidv4");
var __1 = require("..");
var Ticket = /** @class */ (function () {
    function Ticket() {
        this.id = (0, uuidv4_1.uuid)().split("-")[0];
    }
    Object.defineProperty(Ticket, "all", {
        // gets all saved ticket id
        get: function () {
            return __1.client.players.reduce(function (acc, player) { return acc.concat.apply(acc, (player.tickets || [])); }, []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ticket.prototype, "owner", {
        get: function () {
            if (!this.ownerID)
                return;
            return Player_1.Player.fromID(this.ownerID);
        },
        enumerable: false,
        configurable: true
    });
    Ticket.fromID = function (id) {
        var ticket = new Ticket();
        ticket.id = id;
        return ticket;
    };
    Ticket.price = 100;
    return Ticket;
}());
exports.Ticket = Ticket;

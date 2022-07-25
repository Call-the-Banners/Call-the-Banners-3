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
exports.Player = void 0;
var discordjs_utils_1 = require("@jiman24/discordjs-utils");
var luxon_1 = require("luxon");
var __1 = require("..");
var Ticket_1 = require("./Ticket");
var Player = /** @class */ (function () {
    function Player(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.coins = 0;
        this.minAttack = 50;
        this.maxAttack = 100;
        this.lastAttack = new Date(2000);
        this.strikeCount = 0;
        this.tickets = [];
    }
    // Instantiate Sword or General class based on player role. Creates new Sword
    // if player not exists
    Player.fromUser = function (user) {
        var Sword = require("./Sword").Sword;
        return Player.fromID(user.id) || new Sword(user.id, user.username, "sword");
    };
    Player.fromID = function (id) {
        var General = require("./General").General;
        var Sword = require("./Sword").Sword;
        var data = __1.client.players.get(id);
        if (!data)
            return;
        var player = new Sword(id, "", "sword");
        if (data.role === "general") {
            player = new General(data.id, data.name, data.role);
        }
        Object.assign(player, data);
        //@ts-ignore
        player.tickets = player.tickets.map(function (id) { return Ticket_1.Ticket.fromID(id); });
        return player;
    };
    Player.prototype.isOnCooldown = function () {
        var lastAttack = luxon_1.DateTime.fromJSDate(this.lastAttack);
        var diff = Math.abs(lastAttack.diffNow(["hours"]).hours);
        return diff < this.COOLDOWN;
    };
    Player.prototype.timeLeft = function () {
        var lastAttack = luxon_1.DateTime.fromJSDate(this.lastAttack).plus({ hours: this.COOLDOWN });
        var _a = lastAttack.diffNow(["hours", "minutes", "seconds"]), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
        return "".concat(hours, "h ").concat(minutes, "m ").concat(seconds, "s");
    };
    Player.prototype.attack = function () {
        return discordjs_utils_1.random.integer(this.minAttack, this.maxAttack);
    };
    Player.prototype.save = function () {
        var _a = this, COOLDOWN = _a.COOLDOWN, data = __rest(_a, ["COOLDOWN"]);
        __1.client.players.set(this.id, __assign(__assign({}, data), { tickets: data.tickets.map(function (x) { return x.id; }) }));
    };
    return Player;
}());
exports.Player = Player;

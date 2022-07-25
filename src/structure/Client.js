"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Client = void 0;
var commandment_1 = require("@jiman24/commandment");
var discord_js_1 = require("discord.js");
var enmap_1 = require("enmap");
var BattleStage_1 = require("./BattleStage");
var Settings_1 = require("./Settings");
var StrikeHistory_1 = require("./StrikeHistory");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(options) {
        var _this = _super.call(this, options) || this;
        _this.commandManager = new commandment_1.CommandManager(process.env.PREFIX || "!");
        _this.players = new enmap_1["default"]("player");
        _this.castles = new enmap_1["default"]("castle");
        _this.battleStage = new BattleStage_1.BattleStage();
        _this.settings = new Settings_1.Settings();
        _this.strikeHistory = new StrikeHistory_1.StrikeHistory();
        return _this;
    }
    return Client;
}(discord_js_1.Client));
exports.Client = Client;

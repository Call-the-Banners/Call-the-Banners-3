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
exports.Sword = void 0;
var __1 = require("..");
var Player_1 = require("./Player");
var MIN_ATTACK_CAP = 80;
var Sword = /** @class */ (function (_super) {
    __extends(Sword, _super);
    function Sword(id, name, role) {
        var _this = _super.call(this, id, name, role) || this;
        _this.COOLDOWN = __1.client.settings.swordsCooldown;
        return _this;
    }
    Sword.prototype.rankUp = function (currentBattleStrikes) {
        if (this.minAttack < MIN_ATTACK_CAP) {
            if (currentBattleStrikes > 10) {
                this.minAttack += 2;
            }
            else {
                this.minAttack += 1;
            }
        }
    };
    return Sword;
}(Player_1.Player));
exports.Sword = Sword;

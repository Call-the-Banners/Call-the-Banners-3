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
exports.StrikeHistory = void 0;
var enmap_1 = require("enmap");
var StrikeHistory = /** @class */ (function () {
    function StrikeHistory() {
        this.id = "main";
        this.allTime = [];
        this.current = [];
        var data = StrikeHistory.db.get(this.id);
        Object.assign(this, data);
    }
    StrikeHistory.prototype.addStrike = function (strike) {
        this.allTime.push(strike);
        this.current.push(strike);
    };
    // Clears current battle strikes. Should be called on "end" stage
    StrikeHistory.prototype.clear = function () {
        this.current = [];
    };
    StrikeHistory.prototype.save = function () {
        StrikeHistory.db.set(this.id, __assign({}, this));
    };
    StrikeHistory.db = new enmap_1["default"]("strike_history");
    return StrikeHistory;
}());
exports.StrikeHistory = StrikeHistory;

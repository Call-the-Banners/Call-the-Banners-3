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
exports.Settings = void 0;
var enmap_1 = require("enmap");
var Settings = /** @class */ (function () {
    function Settings() {
        this.id = "main";
        this.generalCooldown = 3; // hours
        this.swordsCooldown = 7; // hours
        var data = Settings.db.get(this.id);
        Object.assign(this, data);
    }
    Settings.prototype.save = function () {
        Settings.db.set(this.id, __assign({}, this));
    };
    Settings.db = new enmap_1["default"]("settings");
    return Settings;
}());
exports.Settings = Settings;

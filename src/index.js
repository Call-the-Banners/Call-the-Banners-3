"use strict";
exports.__esModule = true;
exports.client = void 0;
var Client_1 = require("./structure/Client");
var path_1 = require("path");
var dotenv_1 = require("dotenv");
var luxon_1 = require("luxon");
(0, dotenv_1.config)();
exports.client = new Client_1.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "DIRECT_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MEMBERS",
    ],
    partials: [
        "CHANNEL",
        "GUILD_MEMBER",
        "REACTION",
    ]
});
exports.client.commandManager.verbose = true;
exports.client.commandManager.registerCommands(path_1["default"].resolve(__dirname, "./commands"));
exports.client.commandManager.registerCommandNotFoundHandler(function (msg, cmdName) {
    msg.channel.send("Cannot find command \"".concat(cmdName, "\""));
});
exports.client.commandManager.registerCommandOnThrottleHandler(function (msg, cmd, timeLeft) {
    var _a = luxon_1.DateTime.now()
        .plus({ milliseconds: timeLeft })
        .diffNow(["hours", "minutes", "seconds"]), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
    msg.channel.send("You cannot run ".concat(cmd.name, " command after **").concat(hours, "h ").concat(minutes, "m ").concat(seconds, "s**"));
});
exports.client.commandManager.registerCommandErrorHandler(function (err, msg) {
    msg.channel.send(err.message);
    console.log(err);
});
exports.client.on("ready", function () { var _a; return console.log((_a = exports.client.user) === null || _a === void 0 ? void 0 : _a.username, "is ready!"); });
exports.client.on("messageCreate", function (msg) { return exports.client.commandManager.handleMessage(msg); });
exports.client.login(process.env.BOT_TOKEN);

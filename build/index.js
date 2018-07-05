"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const readline_1 = require("./readline");
const event_1 = require("./event");
const cli_tag_1 = require("./cli-tag");
const list_events_without_date_1 = require("./list-events-without-date");
const list_events_without_location_1 = require("./list-events-without-location");
const utils_1 = require("./utils");
const wdEdit = require("wikidata-edit");
const menuOptions = [
    'Insert a human',
    'Insert a war, military campaign, military operation or battle',
    'Insert a tag',
    'List events without a date',
    'List events without a location'
];
const login = () => __awaiter(this, void 0, void 0, function* () {
    const wdEditor = yield wdEdit({
        username: process.env.WDUSER,
        password: process.env.WDPASSWORD,
        userAgent: 'timeline-cli:1.0.0 (https://github.com/chronovis/timeline-cli'
    });
});
const mainMenu = (message = '') => __awaiter(this, void 0, void 0, function* () {
    const opts = menuOptions
        .map((opt, i) => chalk_1.default `{cyan ${i.toString()}} ${opt}`).join('\n')
        .concat(chalk_1.default `\n{cyan Q} Quit`);
    utils_1.clearLog();
    utils_1.logMessage(message);
    utils_1.logHeader('Main Menu');
    console.log(opts);
    const option = yield readline_1.ask(`\nChoose an option: `);
    if (option === '0')
        message = yield event_1.default('human');
    if (option === '1')
        message = yield event_1.default('battle');
    else if (option === '2')
        message = yield cli_tag_1.default();
    else if (option === '3') {
        utils_1.clearLog();
        utils_1.logHeader('Events without dates');
        message = yield list_events_without_date_1.default();
    }
    else if (option === '4') {
        utils_1.clearLog();
        utils_1.logHeader('Events without a location');
        message = yield list_events_without_location_1.default();
    }
    else if (option.toUpperCase() === 'Q') {
        console.log(chalk_1.default `\n{green.bold Good bye!}\n`);
        process.exit(1);
    }
    yield mainMenu(message);
});
exports.default = mainMenu;

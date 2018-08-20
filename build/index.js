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
const search_wikidata_1 = require("./search-wikidata");
const handle_tag_1 = require("./handle-tag");
const list_events_without_1 = require("./list-events-without");
const utils_1 = require("./utils");
const menuOptions = [
    'Insert or update an event',
    'Insert a tag',
    'List events without a date',
    'List events without a location',
    'List events without a label',
];
var MenuAction;
(function (MenuAction) {
    MenuAction["BACK"] = "BACK";
    MenuAction["RELOAD"] = "RELOAD";
    MenuAction["QUIT"] = "QUIT";
})(MenuAction = exports.MenuAction || (exports.MenuAction = {}));
const mainMenu = (message = '', option) => __awaiter(this, void 0, void 0, function* () {
    utils_1.clearLog();
    utils_1.logMessage(message);
    if (option === '0') {
        utils_1.logHeader('Insert or update an event');
        message = yield search_wikidata_1.default();
    }
    else if (option === '1') {
        utils_1.logHeader('Insert a tag');
        message = yield handle_tag_1.default();
    }
    else if (option === '2') {
        utils_1.logHeader('Events without dates');
        message = yield list_events_without_1.default('date');
    }
    else if (option === '3') {
        utils_1.logHeader('Events without a location');
        message = yield list_events_without_1.default('location');
    }
    else if (option === '4') {
        utils_1.logHeader('Events without a label');
        message = yield list_events_without_1.default('label');
    }
    else if (option === 'q' || option === 'Q') {
        message = MenuAction.QUIT;
    }
    else {
        const opts = menuOptions
            .map((opt, i) => chalk_1.default `{cyan ${i.toString()}} ${opt}`).join('\n')
            .concat(chalk_1.default `\n\n{cyan Q} Quit`);
        utils_1.logHeader('Main Menu');
        console.log(opts);
        option = yield readline_1.ask(`\nChoose an option: `);
    }
    if (message === MenuAction.BACK || message === MenuAction.RELOAD) {
        message = null;
        option = null;
    }
    if (message === MenuAction.QUIT) {
        console.log(chalk_1.default `\n{green.bold Good bye!}\n`);
        process.exit(1);
    }
    yield mainMenu(message, option);
});
exports.default = mainMenu;

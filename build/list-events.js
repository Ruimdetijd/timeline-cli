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
const readline_1 = require("./readline");
const chalk_1 = require("chalk");
const constants_1 = require("./constants");
const _1 = require(".");
const utils_1 = require("./utils");
const Table = require("tty-table");
const logOption = (index, label, description = '', id = '') => console.log(chalk_1.default ` {cyan ${index}} {gray ${id}} ${label} {gray ${description}}`);
exports.default = (events, count) => __awaiter(this, void 0, void 0, function* () {
    if (!events.length) {
        console.error(chalk_1.default.yellow('\nNothing found\n'));
    }
    else {
        const table = Table(constants_1.TABLE_HEADER, events.map(utils_1.eventToRow));
        console.log(table.render());
        logOption('', `... and ${count - constants_1.listEventLimit} more\n`);
        logOption('B', 'Back');
        logOption('Q', 'Quit');
        const anwser = yield readline_1.ask('\nEnter a number: ');
        const anwserIndex = parseInt(anwser, 10);
        if (anwser.toUpperCase() === 'B')
            return _1.MenuAction.BACK;
        if (anwser.toUpperCase() === 'Q')
            return _1.MenuAction.QUIT;
        if (isNaN(anwserIndex))
            return _1.MenuAction.RELOAD;
        return events[anwserIndex];
    }
});

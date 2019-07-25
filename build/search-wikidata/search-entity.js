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
const readline_1 = require("../readline");
const chalk_1 = require("chalk");
const utils_1 = require("../utils");
const __1 = require("..");
const Table = require("tty-table");
const constants_1 = require("../constants");
function logOption(index, label, description = '', id = '') {
    console.log(chalk_1.default `{cyan ${index}} {gray ${id}} ${label} {gray ${description}}`);
}
function searchEntity() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchTerm = yield readline_1.ask('Search for: ');
        if (searchTerm === '')
            return;
        const [searchResult] = yield utils_1.execFetch(`${constants_1.wikiApiURL}?action=wbsearchentities&search=${searchTerm.trim()}&language=en&format=json`);
        const entities = searchResult.search;
        if (entities.length) {
            console.log('');
            const table = Table(constants_1.TABLE_HEADER, entities.map(utils_1.entityToRow));
            console.log(table.render());
            console.log('');
            logOption('B', 'Back');
            logOption('Q', 'Quit');
            console.log('');
            const anwser = yield readline_1.ask('Enter a number to insert/update event: ');
            const anwserIndex = parseInt(anwser, 10);
            console.log(anwserIndex);
            if (isNaN(anwserIndex))
                return __1.MenuAction.RELOAD;
            if (anwser.toUpperCase() === 'B')
                return __1.MenuAction.BACK;
            if (anwser.toUpperCase() === 'Q')
                return __1.MenuAction.QUIT;
            return entities[anwserIndex];
        }
    });
}
exports.default = searchEntity;

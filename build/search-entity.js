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
const utils_1 = require("./utils");
const logOption = (index, label, description = '', id = '') => console.log(chalk_1.default `{cyan ${index}} {gray ${id}} ${label} {gray ${description}}`);
exports.default = (eventType) => __awaiter(this, void 0, void 0, function* () {
    const type = (eventType == null) ? '' : ` ${eventType}`;
    const searchTerm = yield readline_1.ask(chalk_1.default `\n{yellow Search for${type}: }`);
    if (searchTerm === '')
        return;
    const searchResult = yield utils_1.execFetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${searchTerm.trim()}&language=en&format=json`);
    const entities = searchResult.search;
    if (entities.length) {
        entities.forEach((ent, i) => logOption(i.toString(), ent.label, ent.description, ent.id));
        console.log(logOption('Q', 'Quit', ''));
        const anwser = yield readline_1.ask('Enter a number: ');
        const anwserIndex = parseInt(anwser, 10);
        if (anwser.toUpperCase() === 'Q' || isNaN(anwserIndex))
            return;
        return entities[anwserIndex];
    }
});

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
const node_fetch_1 = require("node-fetch");
class Entity {
}
exports.Entity = Entity;
exports.default = () => __awaiter(this, void 0, void 0, function* () {
    const searchTerm = yield readline_1.ask(chalk_1.default `\n{yellow Search for: }`);
    const response = yield node_fetch_1.default(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${searchTerm.trim()}&language=en&format=json`);
    const searchResult = yield response.json();
    const entities = searchResult.search;
    if (!entities.length) {
        console.error(chalk_1.default.yellow('\nNothing found\n'));
    }
    else {
        entities.forEach((ent, i) => console.log(chalk_1.default `{cyan ${i.toString()}} ${ent.label} {gray ${ent.description}}`));
        const anwser = yield readline_1.ask('Enter a number: ');
        return entities[parseInt(anwser, 10)];
    }
});

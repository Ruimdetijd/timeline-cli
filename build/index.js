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
const cli_human_1 = require("./cli-human");
const cli_tag_1 = require("./cli-tag");
const menuOptions = [
    'Insert an event',
    'Insert a tag',
    'Quit'
];
const mainMenu = () => __awaiter(this, void 0, void 0, function* () {
    const opts = menuOptions.map((opt, i) => chalk_1.default `{cyan ${i.toString()}} ${opt}`).join('\n');
    console.log(chalk_1.default `{bold.yellow [Timeline] Main Menu}\n${opts}`);
    const option = yield readline_1.ask(`Choose an option: `);
    if (option === '0')
        yield cli_human_1.default();
    else if (option === '1')
        yield cli_tag_1.default();
    else if (option === '2') {
        console.log(chalk_1.default `\n{green.bold Good bye!}\n`);
        process.exit(1);
    }
    yield mainMenu();
});
mainMenu();

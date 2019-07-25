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
const readline = require("readline");
const chalk_1 = require("chalk");
exports.ask = (question) => new Promise((resolve) => {
    question = chalk_1.default `{cyan.bold ${question}}`;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    rl.question(question, (anwser) => {
        resolve(anwser);
        rl.close();
    });
});
exports.confirm = (question, defaultAnwser = 'yes') => __awaiter(this, void 0, void 0, function* () {
    let anwser = yield exports.ask(question);
    if (anwser === '')
        anwser = defaultAnwser;
    return anwser.toLowerCase() === 'y' || anwser.toLowerCase() === 'yes';
});

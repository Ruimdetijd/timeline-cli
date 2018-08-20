#! /usr/bin/env node
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
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const chalk_1 = require("chalk");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const jsonPath = path.resolve(__dirname, '../../war-ids.json');
const IDs = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).slice(260);
let i = 0;
const handleWikidataID = () => __awaiter(this, void 0, void 0, function* () {
    const id = IDs[i];
    const [existingEvent] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${id}`);
    if (existingEvent == null) {
        yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${id}`, { method: 'POST' });
    }
    else {
        console.log(chalk_1.default.yellow(`'${existingEvent.label}' (${existingEvent.wikidata_identifier}) already exists!`));
    }
    if (i < IDs.length - 1) {
        i++;
        console.log(chalk_1.default.cyan(`Number: ${i}`));
        const wait = (existingEvent == null) ? 1000 : 0;
        setTimeout(() => handleWikidataID(), wait);
    }
});
handleWikidataID();

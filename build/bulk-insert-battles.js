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
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const chalk_1 = require("chalk");
const wd_request_1 = require("./wd-request");
const handle_event_1 = require("./handle-event");
const insert_event_tag_relations_1 = require("./db/insert-event-tag-relations");
const utils_1 = require("./db/utils");
const jsonPath = path.resolve(__dirname, '../battles.json');
const battleIDs = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).slice(10900);
let i = 0;
const insertBattle = () => __awaiter(this, void 0, void 0, function* () {
    const id = battleIDs[i];
    const row = yield utils_1.selectOne('event', 'wikidata_identifier', id);
    if (row == null) {
        const entity = yield wd_request_1.fetchEntities([id]);
        const event = yield handle_event_1.default('battle', entity[0]);
        if (event != null)
            yield insert_event_tag_relations_1.default(event.id, [11]);
    }
    else {
        console.log(chalk_1.default.yellow(`'${row.label}' (${row.wikidata_identifier}) already exists!`));
    }
    if (i < battleIDs.length - 1) {
        i++;
        console.log(chalk_1.default.cyan(`Number: ${i}`));
        const wait = (row == null) ? 1000 : 0;
        setTimeout(() => insertBattle(), wait);
    }
});
insertBattle();

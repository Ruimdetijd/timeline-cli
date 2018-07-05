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
const insert_event_tag_relations_1 = require("./db/insert-event-tag-relations");
const chalk_1 = require("chalk");
const utils_1 = require("./db/utils");
const addTags = (event) => __awaiter(this, void 0, void 0, function* () {
    if (event == null)
        return;
    const rows = yield utils_1.execSql(`SELECT * FROM tag`);
    let anwser = yield readline_1.ask(chalk_1.default `\n{yellow Choose tags:}\n${rows.map((r, i) => chalk_1.default `{cyan ${i.toString()}}:${r.label}`).join(', ')}\n`);
    if (anwser.trim() !== '') {
        const tagIndices = anwser
            .split(',')
            .map((t, i) => parseInt(t.trim(), 10))
            .filter(id => !isNaN(id));
        if (tagIndices.length) {
            const confirmed = yield readline_1.confirm(chalk_1.default `Are these tags correct? ${tagIndices.map(t => rows[t].label).join(', ')} {cyan (yes)}`);
            if (confirmed)
                yield insert_event_tag_relations_1.default(event.id, tagIndices.map((t, i) => rows[t].id));
            else
                yield addTags(event);
        }
    }
});
exports.default = addTags;

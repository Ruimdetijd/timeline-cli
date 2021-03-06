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
const search_entity_1 = require("./search-entity");
const add_classes_to_event_1 = require("./add-classes-to-event");
const chalk_1 = require("chalk");
const readline_1 = require("../readline");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const __1 = require("..");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const selection = yield search_entity_1.default();
        if (selection == null)
            return;
        if (selection in __1.MenuAction)
            return selection;
        const entity = selection;
        const [existingEvent] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/by-wikidata-id/${entity.id}`);
        const label = existingEvent == null || existingEvent.lbl == null ? entity.label : existingEvent.lbl;
        if (existingEvent == null || (yield readline_1.confirm(chalk_1.default `{yellow "${label}" already exists.} Sync? {cyan (no)} `, 'no'))) {
            const [event] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/by-wikidata-id/${entity.id}`, { method: 'POST' });
            yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/by-wikidata-id/${entity.id}/image`);
            yield add_classes_to_event_1.default(event);
            return `Event '${event.lbl}' (${event.wid}) ${existingEvent == null ? 'inserted' : 'updated'}!`;
        }
    });
}
exports.default = main;

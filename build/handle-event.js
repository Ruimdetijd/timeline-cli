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
const add_tags_1 = require("./add-tags");
const chalk_1 = require("chalk");
const readline_1 = require("./readline");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const entity = yield search_entity_1.default();
        if (entity == null)
            return;
        let event = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${entity.id}`);
        const label = event == null || event.label == null ? entity.label : event.label;
        if (event == null || (yield readline_1.confirm(chalk_1.default `{yellow "${label}" already exists.} Sync? {cyan (no)} `, 'no'))) {
            event = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${entity.id}`, { method: 'POST' });
        }
        yield add_tags_1.default(event);
        return 'Event inserted!';
    });
}
exports.default = main;

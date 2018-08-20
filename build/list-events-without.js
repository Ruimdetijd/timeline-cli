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
const list_events_1 = require("./list-events");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const index_1 = require("./index");
function listEventsWithout(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const [{ events, count }] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/by-missing/${type}?limit=${constants_1.listEventLimit}`);
        let selection = yield list_events_1.default(events, count);
        if (selection in index_1.MenuAction)
            return selection;
        const event = selection;
        yield utils_1.execFetch(`${constants_1.civslogServerURL}/events/${event.wikidata_identifier}`, { method: 'POST' });
        return `'${event.label}' (${event.wikidata_identifier}) updated`;
    });
}
exports.default = listEventsWithout;

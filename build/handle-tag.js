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
const search_entity_1 = require("./search-entity");
const _1 = require(".");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const selection = yield search_entity_1.default();
        if (selection == null)
            return;
        if (selection in _1.MenuAction)
            return selection;
        const entity = selection;
        const confirmed = yield readline_1.confirm(`Is this correct?\n${entity.id}, ${entity.label}, ${entity.description}\n(yes)\n`);
        if (confirmed)
            yield utils_1.execPost(`${constants_1.civslogServerURL}/tags`, entity);
    });
}
exports.default = main;

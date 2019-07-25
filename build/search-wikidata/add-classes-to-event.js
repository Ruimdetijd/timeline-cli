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
const readline_1 = require("../readline");
const chalk_1 = require("chalk");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const Table = require("tty-table");
const TABLE_HEADER = [
    { value: 'no', color: 'cyan', width: 8 },
    { value: 'label', align: 'left', width: 24 },
];
function addClassesToEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event == null)
            return;
        const [classes] = yield utils_1.execFetch(`${constants_1.civslogServerURL}/classes`);
        const currentTags = event.class != null && event.class.length ?
            event.class.join(', ') :
            '';
        utils_1.logMessage(`Current tags: ${currentTags}`);
        const table = Table(TABLE_HEADER, classes.map(utils_1.tagToRow));
        console.log(table.render());
        let anwser = yield readline_1.ask(chalk_1.default `\n{yellow Choose classes: }`);
        if (anwser.trim() !== '') {
            const classIndices = anwser
                .split(',')
                .map((t) => parseInt(t.trim(), 10))
                .filter(id => !isNaN(id));
            if (classIndices.length) {
                const confirmed = yield readline_1.confirm(chalk_1.default `Are these classes correct?
Prev classes: ${currentTags}
Next classes: ${classIndices.map(i => classes[i]).join(', ')}
{cyan (yes)}`);
                console.log(confirmed);
                if (confirmed)
                    yield utils_1.execPost(`${constants_1.civslogServerURL}/events/${event.id}/classes`, classIndices.map((t) => classes[t]));
            }
        }
    });
}
exports.default = addClassesToEvent;

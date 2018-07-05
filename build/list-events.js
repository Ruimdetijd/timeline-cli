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
const chalk_1 = require("chalk");
const utils_1 = require("./db/utils");
const logOption = (index, label, description = '', id = '') => console.log(chalk_1.default ` {cyan ${index}} {gray ${id}} ${label} {gray ${description}}`);
exports.default = (where, limit = 10) => __awaiter(this, void 0, void 0, function* () {
    const events = yield utils_1.execSql(`SELECT *,
											(
												SELECT json_agg(tag.label)
												FROM tag, event__tag
												WHERE tag.id = event__tag.tag_id
													AND event__tag.event_id = event.id
											) AS tags
											FROM event
											WHERE ${where}
											GROUP BY event.id
											LIMIT ${limit}`);
    const countResult = yield utils_1.execSql(`SELECT COUNT(*) FROM event WHERE ${where}`);
    const count = countResult[0].count;
    if (!events.length) {
        console.error(chalk_1.default.yellow('\nNothing found\n'));
    }
    else {
        console.log(chalk_1.default `{yellow Showing ${limit.toString()} of ${count} events}\n`);
        events.forEach((e, i) => logOption(i.toString(), e.label, e.description, e.wikidata_identifier));
        logOption('Q', 'Quit');
        const anwser = yield readline_1.ask('\nEnter a number: ');
        const anwserIndex = parseInt(anwser, 10);
        if (anwser.toUpperCase() === 'Q' || isNaN(anwserIndex))
            return;
        const event = events[anwserIndex];
        return event;
    }
});

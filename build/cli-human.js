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
const insert_event_1 = require("./insert-event");
const wd_request_1 = require("./wd-request");
const insert_location_1 = require("./insert-location");
const search_entity_1 = require("./search-entity");
const add_tags_1 = require("./add-tags");
const utils_1 = require("./utils");
const chalk_1 = require("chalk");
const readline_1 = require("./readline");
const models_1 = require("./models");
const insert_event_location_relations_1 = require("./insert-event-location-relations");
const onDate = (a, b) => {
    if (a.dateString > b.dateString)
        return 1;
    if (a.dateString < b.dateString)
        return -1;
    return 0;
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const entity = yield search_entity_1.default();
        if (entity == null)
            return;
        let event = yield utils_1.selectOne('event', 'wikidata_identifier', entity.id);
        if (event != null) {
            console.log(chalk_1.default `{yellow "${event.label}" already exists.}`);
        }
        if (event == null || (yield readline_1.confirm(chalk_1.default `Edit birth date/place and death date/place? {cyan (no)} `, 'no'))) {
            const birthDates = yield wd_request_1.fetchClaimValue(entity.id, 'date of birth');
            birthDates.sort(onDate);
            let deathDates = yield wd_request_1.fetchClaimValue(entity.id, 'date of death');
            deathDates = deathDates.map(dd => {
                const date = new Date(dd.timestamp);
                let nextDate;
                if (dd.granularity === 'MONTH') {
                    nextDate = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
                }
                else if (dd.granularity === 'YEAR') {
                    nextDate = new Date(date.getUTCFullYear(), 11, 31);
                }
                if (nextDate != null) {
                    dd.timestamp = nextDate.getTime();
                    dd.dateString = nextDate.toUTCString();
                }
                return dd;
            });
            deathDates.sort(onDate);
            const dates = [null, null, null, null];
            dates[0] = (birthDates.length > 1) ? birthDates[0] : new models_1.WdDate();
            dates[1] = birthDates[birthDates.length - 1];
            dates[2] = deathDates[0];
            dates[3] = (deathDates.length > 1) ? deathDates[deathDates.length - 1] : new models_1.WdDate();
            event = yield insert_event_1.default(entity, dates);
            let birthLocations = yield wd_request_1.getLocations(event.wikidata_identifier, 'place of birth');
            birthLocations = yield Promise.all(birthLocations.map((bl) => __awaiter(this, void 0, void 0, function* () { return yield insert_location_1.default(event, bl); })));
            let deathLocations = yield wd_request_1.getLocations(event.wikidata_identifier, 'place of death');
            deathLocations = yield Promise.all(deathLocations.map((dl) => __awaiter(this, void 0, void 0, function* () { return yield insert_location_1.default(event, dl); })));
            yield insert_event_location_relations_1.default(event, birthLocations, deathLocations);
        }
        yield add_tags_1.default(event);
        console.log(chalk_1.default.green(`\nAll done!\n`));
    });
}
exports.default = main;

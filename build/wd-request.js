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
const chalk_1 = require("chalk");
const models_1 = require("./models");
const utils_1 = require("./utils");
const fetch_dates_1 = require("./fetch-dates");
const propertyIdByName = {
    'place of birth': 'P19',
    'place of death': 'P20',
    'location': 'P276',
    'date of birth': 'P569',
    'date of death': 'P570',
    'point in time': 'P585',
    'inception': 'P571',
    'dissolved, abolished or demolished': 'P576',
    'start time': 'P580',
    'end time': 'P582',
    'coordinate location': 'P625',
};
const granularityByPrecision = {
    7: 'CENTURY',
    8: 'DECADE',
    9: 'YEAR',
    10: 'MONTH',
    11: 'DAY',
};
const parseDataValueTime = (value) => {
    if (!granularityByPrecision.hasOwnProperty(value.precision)) {
        console.error(chalk_1.default `{red Unknown date precision "${value.precision}"}`);
        return;
    }
    const granularity = granularityByPrecision[value.precision];
    const bc = (value.time.charAt(0) === '-') ? '-' : '';
    const dateString = (value.time.charAt(0) === '+' || value.time.charAt(0) === '-') ? value.time.slice(1) : value.time;
    let dateParts = dateString.split(/-|T/);
    dateParts[0] = `${bc}${dateParts[0]}`;
    if (granularity === 'YEAR')
        dateParts = dateParts.slice(0, 1);
    else if (granularity === 'MONTH')
        dateParts = dateParts.slice(0, 2);
    else if (granularity === 'DAY')
        dateParts = dateParts.slice(0, 3);
    if (dateParts.length > 1) {
        dateParts[1] = parseInt(dateParts[1], 10) - 1;
    }
    return {
        dateString,
        granularity,
        timestamp: fetch_dates_1.setUTCDate(...dateParts)
    };
};
const parseDataValueEntity = (value) => {
    return value.id;
};
const parseDateValueCoordinate = (value) => {
    return `${value.latitude} ${value.longitude}`;
};
const parseDataValue = (dataValue) => {
    if (dataValue == null)
        return null;
    const { type, value } = dataValue;
    if (type === 'string')
        return value.value;
    if (type === 'time')
        return parseDataValueTime(value);
    if (type === 'wikibase-entityid')
        return parseDataValueEntity(value);
    if (type === 'globecoordinate')
        return parseDateValueCoordinate(value);
    console.error(chalk_1.default `{red Unknown data value type: "${type}"}`);
};
exports.fetchClaimValue = (wdEntityID, wdPropertyName) => __awaiter(this, void 0, void 0, function* () {
    const wdPropertyId = propertyIdByName[wdPropertyName];
    const json = yield utils_1.execFetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wdEntityID}&property=${wdPropertyId}&format=json`);
    if (!Object.keys(json.claims).length)
        return [];
    return json.claims[wdPropertyId].map(c => parseDataValue(c.mainsnak.datavalue)).filter(c => c != null);
});
exports.fetchEntities = (wdEntityIDs) => __awaiter(this, void 0, void 0, function* () {
    if (!wdEntityIDs.length)
        return [];
    const json = yield utils_1.execFetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wdEntityIDs.join('|')}&props=labels|descriptions&languages=en&format=json`);
    return Object.keys(json.entities).map(k => json.entities[k]).map(e => new models_1.WdEntity(e));
});
exports.getLocations = (wdEntityID, wdPropertyName) => __awaiter(this, void 0, void 0, function* () {
    const locationIds = yield exports.fetchClaimValue(wdEntityID, wdPropertyName);
    const locations = yield exports.fetchEntities(locationIds);
    const createLocation = (p) => __awaiter(this, void 0, void 0, function* () {
        const label = p.label;
        const rawCoordinates = yield exports.fetchClaimValue(p.id, 'coordinate location');
        let coordinates;
        if (rawCoordinates.length) {
            if (rawCoordinates.length > 1)
                utils_1.logError('getLocations', [`Multiple coordinates for location "${label}"`, `values: ${JSON.stringify(rawCoordinates)}`]);
            coordinates = rawCoordinates[0];
        }
        const location = {
            coordinates,
            description: p.description,
            label,
            wikidata_identifier: p.id,
        };
        return location;
    });
    return yield Promise.all(locations.map(createLocation));
});

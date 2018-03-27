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
const node_fetch_1 = require("node-fetch");
const propertyIdByName = {
    'place of birth': 'P19',
    'place of death': 'P20',
    'date of birth': 'P569',
    'date of death': 'P570',
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
    const dateString = value.time.slice(1);
    let dateParts = dateString.split(/-|T/);
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
        timestamp: Date.UTC(...dateParts)
    };
};
const parseDataValueEntity = (value) => {
    return value.id;
};
const parseDateValueCoordinate = (value) => {
    return `${value.latitude} ${value.longitude}`;
};
const parseDataValue = ({ type, value }) => {
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
exports.fetchClaimValue = (wdEntity, wdPropertyName) => __awaiter(this, void 0, void 0, function* () {
    const wdPropertyId = propertyIdByName[wdPropertyName];
    const response = yield node_fetch_1.default(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wdEntity}&property=${wdPropertyId}&format=json`);
    const json = yield response.json();
    return json.claims[wdPropertyId].map(c => parseDataValue(c.mainsnak.datavalue));
});
exports.fetchEntities = (wdEntities) => __awaiter(this, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wdEntities.join('|')}&props=labels|descriptions&languages=en&format=json`);
    const json = yield response.json();
    return Object.keys(json.entities).map(k => json.entities[k]);
});
exports.getLocations = (wdEntity, wdPropertyName) => __awaiter(this, void 0, void 0, function* () {
    const locationIds = yield exports.fetchClaimValue(wdEntity, wdPropertyName);
    const locations = yield exports.fetchEntities(locationIds);
    const createLocation = (p) => __awaiter(this, void 0, void 0, function* () {
        const label = p.labels.en.value;
        const rawCoordinates = yield exports.fetchClaimValue(p.id, 'coordinate location');
        let coordinates;
        if (rawCoordinates.length > 1)
            console.error(chalk_1.default `{red Multiple coordinates for location "${label}"}`);
        else if (rawCoordinates.length)
            coordinates = rawCoordinates[0];
        const location = {
            coordinates,
            description: p.descriptions.en.value,
            label,
            wikidata_identifier: p.id,
        };
        return location;
    });
    return yield Promise.all(locations.map(createLocation));
});

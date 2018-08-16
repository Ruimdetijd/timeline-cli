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
const wd_request_1 = require("./wd-request");
const models_1 = require("./models");
const insert_location_1 = require("./db/insert-location");
const insert_event_location_relations_1 = require("./db/insert-event-location-relations");
exports.default = (eventType, event) => __awaiter(this, void 0, void 0, function* () {
    if (event == null)
        return;
    let locations = [];
    let endLocations = [];
    if (eventType === 'human') {
        locations = yield wd_request_1.getLocations(event.wikidata_identifier, 'place of birth');
        endLocations = yield wd_request_1.getLocations(event.wikidata_identifier, 'place of death');
    }
    else if (eventType === 'battle' || eventType === 'war') {
        const coordinates = yield wd_request_1.fetchClaimValue(event.wikidata_identifier, 'coordinate location');
        locations = coordinates
            .map(coor => {
            const location = new models_1.WdLocation();
            location.coordinates = coor;
            return location;
        });
        if (!locations.length) {
            locations = yield wd_request_1.getLocations(event.wikidata_identifier, 'location');
        }
    }
    locations = yield Promise.all(locations.map((dl) => __awaiter(this, void 0, void 0, function* () { return yield insert_location_1.default(event, dl); })));
    endLocations = yield Promise.all(endLocations.map((dl) => __awaiter(this, void 0, void 0, function* () { return yield insert_location_1.default(event, dl); })));
    yield insert_event_location_relations_1.default(event, locations, endLocations);
});

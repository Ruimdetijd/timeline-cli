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
const update_event_1 = require("./update-event");
const where = `NOT EXISTS (SELECT * FROM event__location WHERE event__location.event_id = event.id)`;
exports.default = () => __awaiter(this, void 0, void 0, function* () {
    const event = yield list_events_1.default(where);
    return yield update_event_1.default(event);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiApiURL = 'https://www.wikidata.org/w/api.php';
exports.civslogServerURL = 'http://localhost:3377';
exports.listEventLimit = 10;
exports.TABLE_HEADER = [
    { value: 'no', color: 'cyan', width: 8 },
    { value: 'wikidata ID', color: 'gray', align: 'left', width: 24 },
    { value: 'label', align: 'left', width: 60 },
    { value: 'description', color: 'gray', align: 'left', width: 100, defaultValue: '' },
];

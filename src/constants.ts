export const wikiApiURL = 'https://www.wikidata.org/w/api.php'
export const civslogServerURL = 'http://localhost:3377'
// export const civslogServerURL = 'http://server:3377'
export const listEventLimit = 1000
export const TABLE_HEADER = [
	{ value: 'no', color: 'cyan', width: 8 },
	{ value: 'wikidata ID', color: 'gray', align: 'left', width: 24 },
	{ value: 'label', align: 'left', width: 60 },
	{ value: 'description', color: 'gray', align: 'left', width: 100, defaultValue: '' },
]
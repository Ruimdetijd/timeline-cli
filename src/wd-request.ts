import chalk from 'chalk'
import { WdDate, WdLocation, WdEntity } from './models'
import { execFetch, logError } from './utils';
import { setUTCDate } from './fetch-dates'

const propertyIdByName: { [key: string]: string } = {
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
}

const granularityByPrecision: { [key: number]: string } = {
	7: 'CENTURY',
	8: 'DECADE',
	9: 'YEAR',
	10: 'MONTH',
	11: 'DAY',
}

const parseDataValueTime = (value): WdDate => {
	if (!granularityByPrecision.hasOwnProperty(value.precision)) {
		console.error(chalk`{red Unknown date precision "${value.precision}"}`)
		return
	}

	const granularity = granularityByPrecision[value.precision]

	const bc = (value.time.charAt(0) === '-') ? '-' : ''
	const dateString = (value.time.charAt(0) === '+' || value.time.charAt(0) === '-') ? value.time.slice(1) : value.time
	let dateParts = dateString.split(/-|T/)
	dateParts[0] = `${bc}${dateParts[0]}`
	if (granularity === 'YEAR') dateParts = dateParts.slice(0, 1)
	else if (granularity === 'MONTH') dateParts = dateParts.slice(0, 2)
	else if (granularity === 'DAY') dateParts = dateParts.slice(0, 3)

	if (dateParts.length > 1) {
		dateParts[1] = parseInt(dateParts[1], 10) - 1
	}

	return {
		dateString,
		granularity,
		// @ts-ignore
		timestamp: setUTCDate(...dateParts)
	}
}

const parseDataValueEntity = (value) => {
	return value.id
}

const parseDateValueCoordinate = (value) => {
	return `${value.latitude} ${value.longitude}`
}

const parseDataValue = (dataValue) => {
	if (dataValue == null) return null
	const { type, value } = dataValue
	if (type === 'string') return value.value
	if (type === 'time') return parseDataValueTime(value)
	if (type === 'wikibase-entityid') return parseDataValueEntity(value)
	if (type === 'globecoordinate') return parseDateValueCoordinate(value)
	console.error(chalk`{red Unknown data value type: "${type}"}`)
}

export const fetchClaimValue = async (wdEntityID: string, wdPropertyName: string): Promise<any[]> => {
	const wdPropertyId = propertyIdByName[wdPropertyName]
	const json = await execFetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wdEntityID}&property=${wdPropertyId}&format=json`)
	if (!Object.keys(json.claims).length) return []
	return json.claims[wdPropertyId].map(c => parseDataValue(c.mainsnak.datavalue)).filter(c => c != null)
}

export const fetchEntities = async (wdEntityIDs: string[]): Promise<WdEntity[]> => {
	if (!wdEntityIDs.length) return []
	const json = await execFetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wdEntityIDs.join('|')}&props=labels|descriptions&languages=en&format=json`)
	return Object.keys(json.entities).map(k => json.entities[k]).map(e => new WdEntity(e))
}

export const getLocations = async (wdEntityID: string, wdPropertyName: string): Promise<WdLocation[]> => {
	const locationIds = await fetchClaimValue(wdEntityID, wdPropertyName)
	const locations = await fetchEntities(locationIds)

	const createLocation = async (p: WdEntity): Promise<WdLocation> => {
		const label = p.label

		const rawCoordinates = await fetchClaimValue(p.id, 'coordinate location')
		let coordinates: string
		if (rawCoordinates.length) {
			if (rawCoordinates.length > 1) logError('getLocations', [`Multiple coordinates for location "${label}"`, `values: ${JSON.stringify(rawCoordinates)}`])
			coordinates = rawCoordinates[0]
		}

		const location: WdLocation = {
			coordinates, 
			description: p.description,
			label,
			wikidata_identifier: p.id,
		}

		return location
	}

	return await Promise.all(locations.map(createLocation))
}
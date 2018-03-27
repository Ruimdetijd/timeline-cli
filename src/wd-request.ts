import chalk from 'chalk'
import fetch from 'node-fetch'
import { WdDate, WdLocation } from './models'

const propertyIdByName: { [key: string]: string } = {
	'place of birth': 'P19',
	'place of death': 'P20',
	'date of birth': 'P569',
	'date of death': 'P570',
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

	const dateString = value.time.slice(1)
	let dateParts = dateString.split(/-|T/)
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
		timestamp: Date.UTC(...dateParts)
	}
}

const parseDataValueEntity = (value) => {
	return value.id
}

const parseDateValueCoordinate = (value) => {
	return `${value.latitude} ${value.longitude}`
}

const parseDataValue = ({ type, value }) => {
	if (type === 'string') return value.value
	if (type === 'time') return parseDataValueTime(value)
	if (type === 'wikibase-entityid') return parseDataValueEntity(value)
	if (type === 'globecoordinate') return parseDateValueCoordinate(value)
	console.error(chalk`{red Unknown data value type: "${type}"}`)
}

export const fetchClaimValue = async (wdEntity: string, wdPropertyName: string): Promise<any[]> => {
	const wdPropertyId = propertyIdByName[wdPropertyName]
	const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wdEntity}&property=${wdPropertyId}&format=json`)
	const json = await response.json()
	return json.claims[wdPropertyId].map(c => parseDataValue(c.mainsnak.datavalue))
}

export const fetchEntities = async (wdEntities: string[]): Promise<any[]> => {
	const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wdEntities.join('|')}&props=labels|descriptions&languages=en&format=json`)
	const json = await response.json()
	return Object.keys(json.entities).map(k => json.entities[k])
}

export const getLocations = async (wdEntity: string, wdPropertyName: string): Promise<WdLocation[]> => {
	const locationIds = await fetchClaimValue(wdEntity, wdPropertyName)
	const locations = await fetchEntities(locationIds)

	const createLocation = async (p): Promise<WdLocation> => {
		const label = p.labels.en.value

		const rawCoordinates = await fetchClaimValue(p.id, 'coordinate location')
		let coordinates: string
		if (rawCoordinates.length > 1) console.error(chalk`{red Multiple coordinates for location "${label}"}`)
		else if (rawCoordinates.length) coordinates = rawCoordinates[0]


		const location: WdLocation = {
			coordinates, 
			description: p.descriptions.en.value,
			label,
			wikidata_identifier: p.id,
		}

		return location
	}

	return await Promise.all(locations.map(createLocation))
}
export class WdDate {
	dateString: string = null
	granularity: string = null
	timestamp: number = null
}

export class WdLocation {
	coordinates: string
	date?: number
	description: string
	end_date?: number
	id?: string
	label: string
	wikidata_identifier: string
}

export class Ev3nt {
	date: number
	date_min: number
	date_granulirity: string
	date_min_granularity: string
	description: string
	end_date: number
	end_date_max: number
	end_date_granularity: string
	end_date_max_granularity: string
	id: string
	label: string
	wikidata_identifier: string
}
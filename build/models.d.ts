export declare class WdDate {
    dateString: string;
    granularity: string;
    timestamp: number;
}
export declare class WdEntity {
    label: string;
    description: string;
    id: string;
    constructor(entity: any);
}
export declare class WdLocation {
    coordinates: string;
    date?: number;
    description: string;
    end_date?: number;
    id?: string;
    label: string;
    wikidata_identifier: string;
}

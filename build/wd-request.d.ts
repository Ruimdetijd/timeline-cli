import { WdLocation } from './models';
export declare const fetchClaimValue: (wdEntity: string, wdPropertyName: string) => Promise<any[]>;
export declare const fetchEntities: (wdEntities: string[]) => Promise<any[]>;
export declare const getLocations: (wdEntity: string, wdPropertyName: string) => Promise<WdLocation[]>;

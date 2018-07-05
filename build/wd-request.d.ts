import { WdLocation, WdEntity } from './models';
export declare const fetchClaimValue: (wdEntityID: string, wdPropertyName: string) => Promise<any[]>;
export declare const fetchEntities: (wdEntityIDs: string[]) => Promise<WdEntity[]>;
export declare const getLocations: (wdEntityID: string, wdPropertyName: string) => Promise<WdLocation[]>;
